# YouTube Overlay - Arkkitehtuuri

## Tekninen ympäristö

YouTube Overlay on rakennettu käyttäen Chrome Extension API:a ja puhdasta JavaScriptiä. Laajennuksessa ei käytetä ulkoisia kirjastoja tai riippuvuuksia.

### Teknologiapino

| Alue | Teknologia |
|------|------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Chrome Extension API (storage, messaging) |
| Pakkaus | Chrome Extension Manifest V3 |
| Tallennus | Chrome Storage API |

## Kansiorakenne

```
youtube-overlay/
│
├── icon16.png                  # Laajennuksen kuvake (16x16px)
├── icon48.png                  # Laajennuksen kuvake (48x48px)
├── icon128.png                 # Laajennuksen kuvake (128x128px)
│
├── background.js               # Taustaskripti, joka hallinnoi viestien välitystä
├── content.js                  # Sivuille injektoitava skripti, joka luo overlay-elementin
├── content.css                 # Overlay-elementin tyylit
├── popup.html                  # Popup-ikkunan HTML-rakenne
├── popup.js                    # Popup-ikkunan toiminnallisuus
│
├── manifest.json               # Laajennuksen määrittelytiedosto
├── README.md                   # Projektin päädokumentaatio
│
└── docs/                       # Dokumentaatiokansio
    ├── readme.md               # Yleistietoa projektista
    ├── description.md          # Sovelluksen kuvaus ja käyttötarkoitus
    ├── architecture.md         # Arkkitehtuuri (tämä tiedosto)
    ├── frontend.md             # Käyttöliittymän kuvaus
    ├── todo.md                 # Tehtävälista
    ├── ai_changelog.md         # Muutoshistoria
    └── learnings.md            # Opitut asiat ja ratkaisut
```

## Arkkitehtuurin komponentit

### Manifest (manifest.json)

Chrome-laajennuksen määrittelytiedosto, joka sisältää:
- Laajennuksen metadatan (nimi, versio, kuvaus)
- Tarvittavat oikeudet (storage, tabs)
- Content scriptin määrittelyt (content.js, content.css)
- Background scriptin määrittelyt (background.js)
- Popup-ikkunan määrittelyt (popup.html)

### Background Script (background.js)

Taustaskripti, joka toimii laajennuksen "moottorina":
- Alustaa laajennuksen asennuksen yhteydessä
- Kuuntelee storage-muutoksia
- Välittää viestejä eri välilehtien välillä
- Hallinnoi kaikkien YouTube-välilehtien päivitysprosessia

```javascript
// Tärkein toiminnallisuus
function updateAllYouTubeTabs(text, callback) {
  // Etsii kaikki YouTube-välilehdet ja lähettää viestin kullekin
  chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
    // ...
    // Päivitä jokainen välilehti
    // ...
  });
}
```

### Content Script (content.js)

Injektoidaan jokaiselle YouTube-sivulle. Vastaa:
- Overlay-elementin luomisesta ja hallinnasta
- Näppäinkomentojen kuuntelusta (CTRL+SHIFT+F3)
- Viestien vastaanottamisesta (popup.js ja background.js)
- Storage-muutosten kuuntelusta

```javascript
// Päätoiminnallisuudet
function createOverlay() { /* Luo overlay-elementin */ }
function updateOverlayText(text) { /* Päivittää tekstin */ }
function toggleOverlay(show) { /* Näyttää/piilottaa overlay-elementin */ }

// Viestinkäsittelijät
chrome.runtime.onMessage.addListener(/* ... */);
chrome.storage.onChanged.addListener(/* ... */);
```

### Popup (popup.html, popup.js)

Käyttöliittymä, joka avautuu kun käyttäjä klikkaa laajennuksen kuvaketta:
- Sisältää tekstikentän ja tallennuspainikkeen
- Mahdollistaa tekstin muokkaamisen
- Viestii tallennetun tekstin content scriptille ja background scriptille

```javascript
// Päätoiminnallisuudet
saveButton.addEventListener('click', function() {
  // Tallenna teksti storageen
  chrome.storage.sync.set({overlayText: text}, function() {
    // Lähetä viesti content scriptille
    // Lähetä viesti background scriptille
  });
});
```

## Tiedonkulku

1. **Tekstin tallennus ja päivitys**:
   ```
   Popup (käyttäjä tallentaa tekstin)
     │
     ├──> Chrome Storage (tallentaa tekstin)
     │      │
     │      └──> Content Script (storage listener päivittää tekstin)
     │
     └──> Background Script (päivittää kaikki muut välilehdet)
            │
            └──> Muut Content Scriptit (päivittävät tekstin)
   ```

2. **Overlay näyttäminen/piilottaminen**:
   ```
   Content Script (käyttäjä painaa CTRL+SHIFT+F3)
     │
     └──> DOM (näyttää/piilottaa overlay-elementin)
   ```

## Turvallisuus ja suorituskyky

- Laajennuksen oikeudet on rajattu vain tarpeellisiin (storage, tabs, youtube.com)
- Content script ladataan `document_start`-vaiheessa, mikä varmistaa että se on käytettävissä heti
- DOM-manipulaatio on minimoitu suorituskyvyn optimoimiseksi
- Virheidenkäsittely on kattavaa mahdollisten ongelmien varalta 