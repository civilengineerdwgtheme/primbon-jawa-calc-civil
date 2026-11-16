# Calc Civil Edition Scope — 8.14.6

This edition was prepared so the distribution would not include datasets for which redistribution rights could not be verified in the source archive.

## Removed

- Quran datasets, Quran prayer lists, and murattal audio lists.
- Hadith datasets and the online hadith loader.
- Al-Hikam text/translations and related audio links.
- Full articles and article excerpts embedded in the application.
- The prayers, salawat, prayer readings, and Maulid texts listed in the third-party notices.

The menus and article tabs for this material were removed from the interface. Navigation buttons, the article panel, and article-loading code were also removed. `app/safe-content.js` keeps empty values to prevent leftover code from trying to load datasets that are not included.

## Retained

The desktop application framework, core calendar calculations and utilities, and optional online connections documented in `PRIVACY.md`.

The in-app browser uses a local browser window with an address bar and navigation controls. Web pages run in a separate `WebContentsView` with Node.js disabled, context isolation and sandboxing enabled, and site permissions denied. Websites and searches open in a window belonging to this software.

This edition has a narrower scope than the original source package. Content may be added back only after its source, edition, redistribution permission, and required attribution have been documented.

The document scanner and device compass pointer features were removed from the desktop edition. The Qibla azimuth calculation remains as a coordinate-based numeric calculation.