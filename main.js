const {
  app,
  BaseWindow,
  BrowserWindow,
  ipcMain,
  Menu,
  session,
  shell,
  WebContentsView,
} = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_URL = pathToFileURL(path.join(__dirname, 'app', 'index.html')).href;
const BROWSER_UI_URL = pathToFileURL(path.join(__dirname, 'app', 'browser.html')).href;
const BROWSER_PRELOAD = path.join(__dirname, 'app', 'browser-preload.js');
const BROWSER_TOOLBAR_HEIGHT = 76;
const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';
const browserWindows = new Map();
let browserSession;

function isAppDocument(rawUrl) {
  try {
    const candidate = new URL(rawUrl);
    const appDocument = new URL(APP_URL);
    return candidate.protocol === 'file:' &&
      candidate.pathname.toLowerCase() === appDocument.pathname.toLowerCase();
  } catch {
    return false;
  }
}

function isBrowserUiDocument(rawUrl) {
  try {
    const candidate = new URL(rawUrl);
    const browserDocument = new URL(BROWSER_UI_URL);
    return candidate.protocol === 'file:' &&
      candidate.pathname.toLowerCase() === browserDocument.pathname.toLowerCase();
  } catch {
    return false;
  }
}

function isWebUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function normalizeBrowserInput(rawInput) {
  const input = String(rawInput || '').trim();
  if (!input) return GOOGLE_SEARCH_URL;

  try {
    const parsed = new URL(input);
    if (isWebUrl(parsed.href)) return parsed.href;
  } catch {
    // Treat ordinary text as a search query below.
  }

  if (!/\s/.test(input) && !/^[a-z][a-z\d+.-]*:/i.test(input) &&
      (input.includes('.') || /^localhost(?::\d+)?(?:\/|$)/i.test(input))) {
    try {
      const candidate = new URL(`https://${input}`);
      if (isWebUrl(candidate.href)) return candidate.href;
    } catch {
      // Invalid address becomes a search query.
    }
  }

  return `${GOOGLE_SEARCH_URL}${encodeURIComponent(input)}`;
}

function getBrowserState(instance) {
  const contents = instance.pageContents;
  const history = contents.navigationHistory;
  return {
    url: contents.getURL(),
    title: contents.getTitle(),
    canGoBack: history.canGoBack(),
    canGoForward: history.canGoForward(),
    isLoading: contents.isLoading(),
  };
}

function sendBrowserState(instance) {
  if (instance.closing || instance.chromeContents.isDestroyed() || instance.pageContents.isDestroyed()) return;
  instance.chromeContents.send('browser:state', getBrowserState(instance));
}

function updateBrowserLayout(instance) {
  if (instance.closing || instance.window.isDestroyed()) return;
  const { width, height } = instance.window.getContentBounds();
  instance.chromeView.setBounds({
    x: 0,
    y: 0,
    width,
    height: BROWSER_TOOLBAR_HEIGHT,
  });
  instance.pageView.setBounds({
    x: 0,
    y: BROWSER_TOOLBAR_HEIGHT,
    width,
    height: Math.max(0, height - BROWSER_TOOLBAR_HEIGHT),
  });
}

function closeBrowserInstance(instance) {
  if (instance.closing) return;
  instance.closing = true;
  browserWindows.delete(instance.id);
  for (const contents of [instance.pageContents, instance.chromeContents]) {
    try {
      if (!contents.isDestroyed()) contents.close({ waitForBeforeUnload: false });
    } catch {
      // Electron may already have destroyed this WebContents during window close.
    }
  }
}

function createBrowserWindow(rawUrl, parentWindow) {
  if (!isWebUrl(rawUrl)) return null;

  const options = {
    width: 1120,
    height: 780,
    minWidth: 640,
    minHeight: 420,
    title: 'Browser Dalam-Aplikasi — Primbon Jawa & Calc Civil',
    icon: path.join(__dirname, 'app', 'icon.png'),
    backgroundColor: '#17130e',
    show: false,
  };
  if (parentWindow && !parentWindow.isDestroyed()) options.parent = parentWindow;

  const browserWindow = new BaseWindow(options);
  const chromeView = new WebContentsView({
    webPreferences: {
      preload: BROWSER_PRELOAD,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false,
    },
  });
  const pageView = new WebContentsView({
    webPreferences: {
      session: browserSession,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    },
  });
  const chromeContents = chromeView.webContents;
  const pageContents = pageView.webContents;
  const instance = {
    id: browserWindow.id,
    window: browserWindow,
    chromeView,
    pageView,
    chromeContents,
    pageContents,
  };
  browserWindows.set(browserWindow.id, instance);

  browserWindow.contentView.addChildView(chromeView);
  browserWindow.contentView.addChildView(pageView);
  updateBrowserLayout(instance);
  browserWindow.on('resize', () => updateBrowserLayout(instance));
  browserWindow.on('closed', () => closeBrowserInstance(instance));

  chromeContents.on('will-navigate', (event, url) => {
    if (!isBrowserUiDocument(url)) event.preventDefault();
  });
  chromeContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  pageContents.on('will-navigate', (event, url) => {
    if (!isWebUrl(url)) event.preventDefault();
  });
  pageContents.on('will-redirect', (details) => {
    if (details.isMainFrame && !isWebUrl(details.url)) details.preventDefault();
  });
  pageContents.setWindowOpenHandler(({ url }) => {
    if (isWebUrl(url)) createBrowserWindow(url, browserWindow);
    return { action: 'deny' };
  });

  const publishState = () => {
    if (instance.closing || pageContents.isDestroyed()) return;
    sendBrowserState(instance);
    const title = pageContents.getTitle();
    if (title) browserWindow.setTitle(`${title} — Browser Dalam-Aplikasi`);
  };
  pageContents.on('did-navigate', publishState);
  pageContents.on('did-navigate-in-page', publishState);
  pageContents.on('page-title-updated', publishState);
  pageContents.on('did-start-loading', publishState);
  pageContents.on('did-stop-loading', publishState);
  pageContents.on('did-fail-load', publishState);

  void chromeContents.loadURL(BROWSER_UI_URL).then(() => {
    updateBrowserLayout(instance);
    sendBrowserState(instance);
  }).catch(() => {});
  void pageContents.loadURL(normalizeBrowserInput(rawUrl)).catch(() => {});
  chromeContents.once('did-finish-load', () => {
    updateBrowserLayout(instance);
    browserWindow.show();
    sendBrowserState(instance);
  });

  return browserWindow;
}

function getBrowserInstanceForSender(sender) {
  const instance = [...browserWindows.values()].find((entry) => entry.chromeContents === sender);
  if (!instance || instance.closing || !isBrowserUiDocument(sender.getURL())) return null;
  return instance;
}

function registerBrowserIpc() {
  ipcMain.handle('browser:navigate', (event, input) => {
    const instance = getBrowserInstanceForSender(event.sender);
    if (!instance) return false;
    const url = normalizeBrowserInput(input);
    if (!isWebUrl(url)) return false;
    void instance.pageContents.loadURL(url).catch(() => {});
    return true;
  });
  ipcMain.handle('browser:back', (event) => {
    const instance = getBrowserInstanceForSender(event.sender);
    if (!instance) return false;
    const history = instance.pageContents.navigationHistory;
    if (history.canGoBack()) history.goBack();
    sendBrowserState(instance);
    return true;
  });
  ipcMain.handle('browser:forward', (event) => {
    const instance = getBrowserInstanceForSender(event.sender);
    if (!instance) return false;
    const history = instance.pageContents.navigationHistory;
    if (history.canGoForward()) history.goForward();
    sendBrowserState(instance);
    return true;
  });
  ipcMain.handle('browser:reload', (event) => {
    const instance = getBrowserInstanceForSender(event.sender);
    if (!instance) return false;
    instance.pageContents.reload();
    sendBrowserState(instance);
    return true;
  });
  ipcMain.handle('browser:home', (event) => {
    const instance = getBrowserInstanceForSender(event.sender);
    if (!instance) return false;
    void instance.pageContents.loadURL(GOOGLE_SEARCH_URL).catch(() => {});
    return true;
  });
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 480,
    minHeight: 600,
    title: 'Primbon Jawa & Calc Civil',
    icon: path.join(__dirname, 'app', 'icon.png'),
    backgroundColor: '#1a120b',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (isAppDocument(url)) return;
    event.preventDefault();
    if (isWebUrl(url)) createBrowserWindow(url, win);
    else if (isAllowedMailto(url)) void shell.openExternal(url).catch(() => {});
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isWebUrl(url)) createBrowserWindow(url, win);
    else if (isAllowedMailto(url)) void shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });

  void win.loadURL(APP_URL);
}

function isAllowedMailto(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'mailto:' && url.pathname.toLowerCase() === 'titoreista.dev@gmail.com';
  } catch {
    return false;
  }
}

function isAllowedAppPermission(webContents, permission) {
  if (!webContents || permission !== 'geolocation') return false;
  try {
    return isAppDocument(webContents.getURL());
  } catch {
    return false;
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  browserSession = session.fromPartition('persist:primbon-in-app-browser');
  browserSession.setPermissionCheckHandler(() => false);
  browserSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));

  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    return isAllowedAppPermission(webContents, permission);
  });
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(isAllowedAppPermission(webContents, permission));
  });

  registerBrowserIpc();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
