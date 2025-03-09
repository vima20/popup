# YouTube Overlay -laajennus

Chrome-laajennus, joka näyttää mukautettavan tekstin YouTube-videoiden päällä.

## Ominaisuudet

- Näyttää mukautettavan tekstin YouTube-videoiden päällä
- Tekstiä voi muokata laajennuksen popup-ikkunasta
- Teksti voidaan näyttää/piilottaa pikanäppäimellä (CTRL + SHIFT + F3)
- Teksti tallennetaan selaimen muistiin

## Teknologiat

- Vue 3 + TypeScript
- Vite
- Chrome Extension API

## Asennus kehitysympäristöön

1. Kloonaa repositorio:
```bash
git clone https://github.com/vima20/demo1.git
cd demo1
```

2. Asenna riippuvuudet:
```bash
npm install
```

3. Käynnistä kehitysympäristö:
```bash
npm run dev
```

4. Rakenna laajennus:
```bash
npm run build
```

5. Lataa laajennus Chromeen:
- Avaa Chrome ja mene osoitteeseen `chrome://extensions`
- Ota kehittäjätila käyttöön oikeasta yläkulmasta
- Klikkaa "Lataa pakkaamaton" -painiketta
- Valitse projektin `dist`-kansio

## Käyttö

1. Mene YouTubeen ja avaa video
2. Paina CTRL + SHIFT + F3 nähdäksesi tekstin
3. Muokkaa tekstiä klikkaamalla laajennuksen kuvaketta

## Tiedostorakenne

```
dist/               # Käännetyt tiedostot
  ├── icons/       # Laajennuksen ikonit
  ├── assets/      # CSS ja muut resurssit
  ├── content.js   # Content script
  ├── popup.js     # Popup-ikkunan koodi
  └── background.js # Taustapalvelu

src/
  ├── components/  # Vue-komponentit
  ├── composables/ # Vue-composables
  ├── content/     # Content script lähdekoodi
  └── popup/       # Popup-ikkunan lähdekoodi
```

## Kehitys

- Käytä `npm run dev` kehitysympäristössä
- Käytä `npm run build` tuotantoversion rakentamiseen
- Käytä `npm run test` testien ajamiseen

## Lisenssi
MIT 