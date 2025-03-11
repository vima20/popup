# YouTube Overlay Chrome -laajennus

Chrome-laajennus, joka mahdollistaa tekstin näyttämisen YouTube-videoiden päällä näppäinyhdistelmällä CTRL+SHIFT+F3.

## Yleiskatsaus

Tämä laajennus on yksinkertainen ratkaisu tekstin näyttämiseen YouTube-videoiden päällä. Käyttäjä voi määrittää haluamansa tekstin, joka ilmestyy videon päälle painettaessa CTRL+SHIFT+F3. Tekstiä voi muokata milloin tahansa klikkaamalla laajennuksen kuvaketta selaimen työkalupalkissa.

## Uusimmat ominaisuudet (V5.0)

- Dynaaminen content scriptin injektointi
- Parannettu luotettavuutta monivaiheisella viestinnällä
- Uudistettu viestintäjärjestelmä popup, background ja content scriptien välillä
- Lisätty API content scriptin tilan kyselyyn
- Parannettu virhetilanteiden käsittelyä kaikissa komponenteissa
- Selkeämmät lokiviestit helpompaan vianetsintään
- Päivitetty tiedostorakenne erottamaan lähdekoodi ja julkaisu

## Asennus ja käyttöönotto

### Kehittäjätila

1. Kloonaa repositorio tai lataa tiedostot
2. Avaa Chrome-selain
3. Siirry osoitteeseen `chrome://extensions/`
4. Ota käyttöön "Kehittäjätila" (Developer mode) sivun oikeasta yläkulmasta
5. Klikkaa "Lataa pakkaamaton" (Load unpacked) ja valitse projektin `dist`-kansio
6. Laajennus on nyt asennettu ja valmis käytettäväksi

### Käyttö

1. Navigoi YouTube-sivulle
2. Klikkaa laajennuksen kuvaketta selaimen työkalupalkissa
3. Syötä haluamasi teksti
4. Paina "Tallenna"
5. Paina CTRL+SHIFT+F3 näyttääksesi tekstin videon päällä
6. Teksti katoaa automaattisesti 3 sekunnin kuluttua

### Vianetsintä

Jos laajennus ei toimi odotetusti:
1. Tarkista että olet YouTube-sivulla
2. Päivitä sivu (F5)
3. Paina "Testaa päivitys" -nappia popup-ikkunassa
4. Tarkista virheilmoitukset popup-ikkunassa ja selaimen konsolissa (F12)
5. Jos mikään ei auta, poista laajennus ja asenna se uudelleen

## Tekninen toteutus

Laajennus koostuu kolmesta pääkomponentista:

1. **Background Script (V5.0)** - Tarkkailee välilehtien tilaa, injektoi content scriptin dynaamisesti ja hallinnoi viestintää
2. **Content Script (V5.0)** - Luo ja hallitsee overlay-elementtiä, reagoi näppäinkomentoihin
3. **Popup (V5.0)** - Käyttöliittymä tekstin syöttämiseen ja tallentamiseen

### Edistynyt viestinvälitys

- Background script injektoi content scriptin tarvittaessa
- Popup varmistaa content scriptin injektion ennen viestin lähettämistä
- Kaikki komponentit kommunikoivat luotettavalla vastausjärjestelmällä

## Hakemistorakenne

```
youtube-overlay/
│
├── dist/                      # Julkaisukansio
│   ├── icons/                 # Kuvakkeet
│   ├── background.js          # Background script
│   ├── content.js             # Content script
│   ├── content.css            # Content tyylit
│   ├── popup.html             # Popup HTML
│   ├── popup.js               # Popup JavaScript
│   └── manifest.json          # Laajennuksen määrittelyt
│
├── src/                       # Lähdekoodikansio
│   ├── background.js          # Background scriptin lähdekoodi
│   ├── content.js             # Content scriptin lähdekoodi
│   ├── content.css            # Content tyylien lähdekoodi
│   ├── popup.html             # Popup HTML lähdekoodi
│   └── popup.js               # Popup JavaScript lähdekoodi
│
└── docs/                      # Dokumentaatio
```

## Projektitiedostot

Katso tarkemmat tiedot seuraavista dokumenteista:

- [Kuvaus ja käyttötarkoitus](description.md)
- [Arkkitehtuuri ja tekninen toteutus](architecture.md)
- [Käyttöliittymä](frontend.md)
- [Tehtävälista](todo.md)
- [Muutoshistoria](ai_changelog.md)
- [Opitut asiat ja ratkaisut](learnings.md)

## Versiohistoria

- **V5.0** - Dynaaminen content script injektointi, parannettu luotettavuus
- **V4.0** - Luotettavuusparannukset, optimoitu viestinkäsittely
- **V3.0** - Yksinkertaistettu koodi, parannetut tarkistukset
- **V2.0** - Automaattinen päivitys kaikille välilehdille
- **V1.0** - Ensimmäinen toimiva versio

## Lisenssi

MIT 