(() => {
  const api = window.PJBrowserWindow;
  const address = document.getElementById('address');
  const form = document.getElementById('addressForm');
  const back = document.getElementById('back');
  const forward = document.getElementById('forward');
  const reload = document.getElementById('reload');
  const home = document.getElementById('home');
  const title = document.getElementById('pageTitle');
  const dot = document.getElementById('dot');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void api.navigate(address.value);
    address.blur();
  });
  back.addEventListener('click', () => void api.back());
  forward.addEventListener('click', () => void api.forward());
  reload.addEventListener('click', () => void api.reload());
  home.addEventListener('click', () => void api.home());

  api.onState((state) => {
    if (!state) return;
    if (state.url && !address.matches(':focus')) address.value = state.url;
    back.disabled = !state.canGoBack;
    forward.disabled = !state.canGoForward;
    dot.classList.toggle('loading', Boolean(state.isLoading));
    title.textContent = state.isLoading ? 'Memuat halaman…' : (state.title || state.url || 'Siap menjelajah web');
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      address.focus();
      address.select();
    }
  });
})();
