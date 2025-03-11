# YouTube Overlay - Käyttöliittymä

## Käyttöliittymän komponentit

YouTube Overlay -laajennuksen käyttöliittymä koostuu kahdesta pääkomponentista:

1. **Popup-ikkuna** - Avautuu kun käyttäjä klikkaa laajennuksen kuvaketta
2. **Overlay-elementti** - Näkyy YouTube-videon päällä kun aktivoidaan

## Popup-ikkuna

![Popup-ikkuna](../images/popup-screenshot.png) *(Huomautus: kuvankaappaus on viitteellinen)*

### Rakenne

Popup-ikkuna on HTML-pohjainen yksinkertainen käyttöliittymä, joka sisältää:

- **Otsikko**: "YouTube Overlay"
- **Tekstikenttä**: Käyttäjän määrittelemän tekstin syöttämiseen
- **Tallenna-painike**: Tekstin tallentamiseen
- **Tilakenttä**: Näyttää toiminnon tilan (onnistuminen/virhe)
- **Ohjeteksti**: Kertoo näppäinyhdistelmän (CTRL+SHIFT+F3)
- **Debug-painike**: Testauspainike toiminnallisuuden varmistamiseen

### Tyylit

Popup-ikkunan tyylit on määritelty inline-tyyleillä popup.html-tiedostossa:

```css
body { 
  width: 250px; 
  padding: 10px; 
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}
h3 {
  margin-top: 0;
  color: #333;
}
input { 
  width: 100%; 
  padding: 8px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button { 
  width: 100%; 
  margin-top: 8px;
  padding: 8px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.status { 
  margin-top: 10px; 
  padding: 5px;
  text-align: center;
  font-size: 14px;
}
.success { 
  color: #0f8c3e; 
}
.error { 
  color: #e03c31; 
}
.debug-button {
  margin-top: 10px;
  font-size: 10px;
  background-color: #ccc;
}
```

### Käyttäjäpalautteen tyypit

Popup-ikkunan tilaviestit ilmaisevat käyttäjälle toiminnon tilan seuraavilla väreillä:

- **Vihreä** (#0f8c3e): Onnistunut toiminto
- **Punainen** (#e03c31): Virhe toiminnossa
- **Harmaa** (oletusteksti): Informatiivinen viesti

## Overlay-elementti

![Overlay-esimerkki](../images/overlay-screenshot.png) *(Huomautus: kuvankaappaus on viitteellinen)*

### Rakenne

Overlay-elementti on yksinkertainen HTML-div-elementti, joka luodaan dynaamisesti injektoidulla JavaScript-koodilla (content.js). Elementti:

- Näytetään YouTube-videon päällä
- Sisältää käyttäjän määrittelemän tekstin
- Voidaan näyttää/piilottaa näppäinyhdistelmällä CTRL+SHIFT+F3

### Tyylit

Overlay-elementin tyylit on määritelty content.css-tiedostossa:

```css
#youtube-overlay-extension {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 9999999;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 24px;
  font-weight: bold;
  pointer-events: none;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
```

Näillä tyyleillä saavutetaan:
- Keskitetty sijainti videon päällä (fixed position, transform)
- Puoliläpinäkyvä tumma tausta (rgba-väri 80% läpinäkyvyydellä)
- Valkoinen, lihavoitu teksti
- Pehmeät reunat (border-radius)
- Elementti päällimmäisenä (korkea z-index)
- Läpinäkyvä tausta hiiren klikkauksille (pointer-events: none)
- Pehmeä fade-animaatio näyttämiseen/piilottamiseen (transition)

## Käyttäjävuorovaikutus

### Popup-ikkunan käyttö

1. Käyttäjä klikkaa laajennuksen kuvaketta selaimessa
2. Popup-ikkuna avautuu
3. Käyttäjä syöttää haluamansa tekstin tekstikenttään
4. Käyttäjä klikkaa "Tallenna"-painiketta
5. Tilakenttä näyttää onnistumis- tai virheviestin

### Overlay-elementin käyttö

1. Käyttäjä navigoi YouTube-sivulle
2. Käyttäjä painaa CTRL+SHIFT+F3
3. Overlay-elementti ilmestyy videon päälle fade-animaatiolla
4. Käyttäjä painaa CTRL+SHIFT+F3 uudelleen
5. Overlay-elementti katoaa fade-animaatiolla

## Responsiivisuus

Overlay-elementti on suunniteltu toimimaan kaikenkokoisilla YouTube-videoilla:
- Keskitetty sijainti varmistaa, että teksti on aina videon keskellä
- Maksimileveys (max-width: 80%) estää tekstiä menemästä videon rajojen ulkopuolelle pienillä näytöillä
- Kiinteä fonttikoko varmistaa luettavuuden kaikilla näytöillä

## Saavutettavuus

Vaikka saavutettavuudelle ei ole tehty erityisiä optimointeja, sovellus huomioi:
- Riittävän kontrastin tekstin ja taustan välillä
- Selkeät visuaaliset palautteet toiminnoista
- Mahdollisuuden käyttää näppäimistöä overlay-elementin näyttämiseen/piilottamiseen 