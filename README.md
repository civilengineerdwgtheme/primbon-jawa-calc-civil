# Primbon Jawa & Calc Civil

A Windows desktop application for Javanese calendar and Primbon calculations, zodiac and Chinese zodiac references, Islamic worship tools, and civil engineering calculators. Version **8.14.6**.

This package contains the features available in the included desktop edition. Materials and features that are unavailable or lack verified redistribution permissions have been removed from the interface.

The Compass — Cardinal Directions and Document Scanner features were removed from the desktop edition because this package cannot support them reliably. The Qibla Azimuth calculation remains available as a location- or coordinate-based numeric result and does not use an orientation sensor.

The in-app browser opens websites and searches in a window owned by this software. Its address bar accepts URLs or search terms, and it includes back, forward, reload, and search-page controls. Links from the application and web pop-ups open in the software's browser window. The browser requires an internet connection and does not claim to support multiple tabs or ad blocking.

This release fixes browser-window cleanup on close by storing a WebContents reference earlier and skipping objects that have already been destroyed.

## Run from source

Requirement: Node.js 24.

```powershell
npm ci
npm start
```

## Build the Windows package

```powershell
npm ci
npm run dist:portable
```

The build output is written to `release-final/`. The portable candidate targets Windows x64. The binary is not signed with a code-signing certificate, so Windows may show an unknown publisher warning.

## Privacy

Core calculations run on the device. Available online features may contact weather, location search, exchange-rate/market, map, embedded-media, and Pollinations AI services, as well as websites opened in the in-app browser. Prompts sent to AI leave the device. Providers may process IP addresses and request metadata. See [PRIVACY.md](PRIVACY.md) for details.

## License and scope

Project code is licensed under the MIT License; see [LICENSE](LICENSE). This license covers only code authored for this project. Unverified third-party content has been excluded from this package. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [CORE-EDITION.md](CORE-EDITION.md).

The application icon was created from the icon supplied for this release.

## About

Developer: Tito Reista — titoreista.dev@gmail.com