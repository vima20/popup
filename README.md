# Video Overlay - Chrome-laajennus

Video Overlay on selainlaajennus, joka mahdollistaa ohjaajan viestien näyttämisen katsojille videoiden aikana. Katsojat voivat aktivoida palvelun ja vastaanottaa ohjaajan lähettämiä viestejä reaaliajassa.

## Ominaisuudet

### Katsojan ominaisuudet
- Toimii kaikilla suosituilla videopalveluilla (YouTube, Vimeo, Netflix, jne.)
- Palvelun aktivointi/deaktivointi näppäinyhdistelmällä (CTRL+SHIFT+9)
- Viestien näyttäminen/piilottaminen samalla näppäinyhdistelmällä
- Palvelu pysyy aktiivisena kunnes katsoja deaktivoi sen

### Ohjaajan ominaisuudet
- Helppokäyttöinen web-käyttöliittymä viestien lähettämiseen
- Reaaliaikainen viestien lähetys kaikille aktiivisille katsojille
- Viestin tyyliasetusten hallinta (koko, väri, sijainti)
- Aktiivisten katsojien määrän seuranta

## Käyttöohjeet

### Katsojan ohjeet

1. Asenna laajennus Chrome-selaimeen
   - Lataa lähdekoodit
   - Avaa Chrome ja mene osoitteeseen `chrome://extensions/`
   - Ota käyttöön "Developer mode" oikeasta yläkulmasta
   - Klikkaa "Load unpacked" ja valitse `dist`-hakemisto

2. Palvelun käyttö
   - Avaa mikä tahansa video tuetulta sivustolta
   - Paina CTRL+SHIFT+9 aktivoidaksesi palvelun
   - Vastaanota ohjaajan viestit automaattisesti
   - Paina CTRL+SHIFT+9 näyttääksesi/piilottaaksesi viestit
   - Palvelu pysyy aktiivisena kunnes deaktivoit sen

### Ohjaajan ohjeet

1. Käynnistä palvelin:
   ```bash
   npm run start:server
   ```

2. Käytä web-käyttöliittymää:
   - Avaa selaimessa: `http://localhost:3000`
   - Kirjaudu sisään ohjaajan tunnuksilla
   - Näet aktiivisten katsojien määrän
   - Kirjoita viesti ja valitse tyyliasetukset
   - Lähetä viesti kaikille aktiivisille katsojille

## Kehitys

Projektin kehittäminen:

```bash
# Asenna riippuvuudet
npm run install:all

# Kehitysympäristö
npm run dev:all

# Rakenna tuotantoversio
npm run build

# Testit
npm run test
npm run test:server
```

## Hakemistorakenne

```
video-overlay/
├── dist/                # Käännetty laajennus
├── server/              # WebSocket-palvelin
│   ├── index.js         # Palvelimen pääkoodi
│   └── ...
├── src/                 # Lähdekoodit
│   ├── background/      # Background script
│   ├── components/      # Vue-komponentit
│   ├── config/          # Konfiguraatiot
│   ├── content/         # Content script
│   ├── lib/             # Apukirjastot
│   ├── popup/           # Popup-käyttöliittymä
│   └── types/           # TypeScript-tyypit
├── tests/               # Testit
├── manifest.json        # Chrome-laajennuksen manifest
└── vite.config.ts       # Vite-konfiguraatio
```

## Teknologiat

- Vue 3 + TypeScript
- Tailwind CSS
- WebSocket
- Chrome Extension API
- Vite + CRXJS

## Lisenssi

MIT 