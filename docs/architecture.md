# Video Overlay - Arkkitehtuuri

## Tekninen pino
- **Frontend Framework**: Chrome Extension
- **Build Tool**: Vite
- **Kieli**: JavaScript/TypeScript
- **Tyylit**: CSS
- **Backend**: Node.js WebSocket-palvelin

## Tiedostorakenne
```
video-overlay/
├── public/
│   ├── manifest.json      # Chrome Extension manifest
│   ├── testi.html        # Testisivu ohjaajan viestille
│   └── icons/            # Laajennuksen ikonit
├── src/
│   ├── background.js     # Background script
│   ├── content.js        # Content script
│   └── popup/            # Popup-ikkunan tiedostot
│       ├── popup.html    # Popup-ikkunan HTML
│       └── index.js      # Popup-ikkunan logiikka
├── server/               # WebSocket-palvelin
│   ├── index.js         # WebSocket-palvelimen toteutus
│   ├── server.js        # Palvelimen käynnistys
│   └── public/          # Staattiset tiedostot
└── dist/                 # Buildattu laajennus
```

## Komponentit

### 1. Background Script (background.js)
- Käsittelee näppäinkomennot
- Välittää viestejä content scriptille
- Hallinnoi laajennuksen elinkaarta

### 2. Content Script (content.js)
- Luo overlay-elementin sivulle
- Yhdistää WebSocket-palvelimeen
- Näyttää viestit overlay-elementissä
- Käsittelee viestit WebSocket-palvelimelta

### 3. Popup (popup/)
- Yksinkertainen käyttöliittymä viestin syöttämiseen
- Mahdollistaa viestin näyttämisen manuaalisesti
- Näyttää pikanäppäinohjeet

### 4. WebSocket-palvelin (server/)
- Tarjoaa reaaliaikaisen viestinnän
- Hallinnoi yhteyksiä ohjaajan ja katsojien välillä
- Seuraa katsojamääriä URL-kohtaisesti
- Tarjoaa staattisia tiedostoja testausta varten

## Viestintä
1. Käyttäjä painaa CTRL+SHIFT+9
2. Background script vastaanottaa komennon
3. Content script lähettää viestin WebSocket-palvelimelle
4. WebSocket-palvelin välittää viestin kaikille katsojille
5. Content script näyttää viestin overlay-elementissä

## Build-prosessi
1. Vite kääntää TypeScript/JavaScript tiedostot
2. Tiedostot kopioidaan dist-kansioon
3. Manifest.json ja ikonit kopioidaan dist-kansioon
4. Laajennus on valmis ladattavaksi Chromeen

## Palvelimen käynnistys
```bash
# Kehitysympäristö
cd server
npm install
node server.js

# Palvelin käynnistyy osoitteeseen:
# http://localhost:8080
# WebSocket: ws://localhost:8080/ws
``` 