# Third-Party Notices — Primbon Jawa & Calc Civil

## Content scope

This package does not distribute the following datasets from the earlier source archive:

- Quran data (`quran.js`) and related lists/audio.
- Hadith data (`hadis.js`) and its additional online loader.
- Al-Hikam text and translations (`alhikam.js`) and related audio links.
- Full articles and excerpts (`articles_body.js` and the article database in `index.html`).
- Barzanji, Burdah, Simtud Durar, Diba', Azab, prayer collections, salawat, and prayer readings.

Those source files were excluded from this desktop package. Their menu items were removed from the interface; article tabs and loaders were removed as well. `app/safe-content.js` only sets empty datasets and does not contain replacement third-party text.

## License

`LICENSE` grants the MIT License for project code written for this application. It does not change the rights to third-party works that are not included. Electron build dependencies are recorded in `package-lock.json`; source installation obtains dependencies under the respective upstream licenses.

## Online services

Available features may use BMKG, Open-Meteo, OpenStreetMap/Nominatim, exchange-rate/market services, maps/embedded media, Pollinations AI, and websites selected by the user in the in-app browser. The browser uses Chromium distributed with Electron; websites remain subject to each provider's terms of service and privacy policy. See `PRIVACY.md`.