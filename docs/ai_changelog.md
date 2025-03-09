# AI Changelog

## [2024-03-20]
- Korjattu YouTube Overlay -laajennuksen toiminnallisuus
  - Lisätty oikeat oikeudet manifest.json-tiedostoon
  - Korjattu viestintä popup-ikkunan ja content scriptin välillä
  - Korjattu Chrome Storage API:n käyttö
- Päivitetty dokumentaatio vastaamaan toteutettua ratkaisua
  - Lisätty kuvaus sovelluksesta (description.md)
  - Päivitetty tekninen arkkitehtuuri (architecture.md)
  - Lisätty käyttöliittymän dokumentaatio (frontend.md)

## 2024-03-19
### Lisätty
- Luotu perus dokumentaatiokansio
- Lisätty seuraavat dokumentaatiotiedostot:
  - readme.md: Projektin perustiedot ja asennusohjeet
  - description.md: Sovelluksen kuvaus ja käyttötapaukset
  - architecture.md: Tekninen arkkitehtuuri ja komponentit
  - frontend.md: Käyttöliittymän kuvaus
  - todo.md: Tehtävälista ja prioriteetit
  - ai_changelog.md: Muutosloki
  - learnings.md: Oppimiskokemukset ja ratkaisut

### Muutettu
- Ei muutoksia

### Poistettu
- Ei poistoja

## 2024-03-19 (Koodin päivitys)
### Lisätty
- Luotu perusprojektin rakenne
- Lisätty TypeScript-määritykset Vue-tiedostoille
- Lisätty puuttuvat riippuvuudet package.json tiedostoon
- Lisätty preview-skripti package.json tiedostoon

### Muutettu
- Korjattu Overlay.vue komponentin importit
- Päivitetty manifest.json tiedoston polut ja määritykset
- Lisätty CSS-tiedoston määritys manifest.json tiedostoon

### Poistettu
- Ei poistoja

## 2024-03-19 (Testien päivitys)
### Lisätty
- Lisätty kattavat yksikkötestit:
  - Overlay.spec.ts: Komponentin renderöinti, props, näkyvyys, tyylit ja näppäinyhdistelmän käsittely
  - App.spec.ts: Popup-komponentin renderöinti, otsikko, tyylit ja versionumero
  - Content Script (index.spec.ts): DOM-manipulaatio ja näppäinyhdistelmän käsittely
- Lisätty mockit event listenereille ja DOM-elementeille
- Lisätty negatiiviset testit näppäinyhdistelmille

### Muutettu
- Päivitetty Overlay-komponentin toteutus käyttämään isVisible propia ref:n sijaan
- Päivitetty testit vastaamaan uutta toteutusta
- Poistettu turha toggle-napin testi App.spec.ts tiedostosta

### Poistettu
- Ei poistoja

## 2024-03-19 (E2E-testien lisäys)
### Lisätty
- Lisätty Cypress-konfiguraatio selainlaajennuksen testaamista varten
- Lisätty custom Cypress-komennot:
  - loadExtension: Laajennuksen lataus ja mockit
  - pressKeyCombination: Näppäinyhdistelmien simulointi
  - checkOverlay: Overlay-komponentin tarkistus
- Lisätty E2E-testit:
  - overlay.cy.ts: Overlay-toiminnallisuuden testit
  - popup.cy.ts: Popup-ikkunan testit
- Lisätty testit näppäinyhdistelmille ja tyyleille

### Muutettu
- Päivitetty todo.md vastaamaan E2E-testien tilaa
- Päivitetty Cypress-konfiguraatio tukemaan selainlaajennuksen testaamista

### Poistettu
- Ei poistoja

## [2024-03-XX] YouTube Overlay -laajennuksen korjaukset

### Korjattu
- Overlay-komponentin reaktiivisuus ja tilan hallinta
- Content scriptin resurssien hallinta ja siivous
- TypeScript-tyyppien määrittelyt
- Event handlerien käsittely ja siivous

### Lisätty
- Cleanup-funktio resurssien vapauttamiseen
- Unload event handleri
- Debug-loggaus
- Event.preventDefault() F3-näppäimelle

### Tekninen velka
- Yksikkötestien lisääminen
- E2E-testien kirjoittaminen
- Suorituskyvyn optimointi
- Koodin refaktorointi modulaarisemmaksi

## 2024-03-09

### Korjaukset
- Korjattu manifest.json:n polut vastaamaan dist-kansion rakennetta
- Siirretty ikonit icons-kansioon
- Poistettu ylimääräiset tiedostot dist-kansiosta

### Dokumentaatio
- Päivitetty README.md vastaamaan nykyistä toteutusta
- Lisätty yksityiskohtainen arkkitehtuurikuvaus
- Lisätty frontend-dokumentaatio komponenteista ja tyyleistä
- Päivitetty todo-lista vastaamaan projektin nykytilaa

### Seuraavat vaiheet
1. Yksikkötestien kirjoittaminen
2. Tekstin tyylin muokkausominaisuuksien lisääminen
3. Firefox-tuen lisääminen

## 9.3.2024

### Korjaukset
- Korjattu tekstin muuttaminen toimimaan oikein
- Poistettu Vue.js riippuvuus popup-ikkunasta
- Korjattu content scriptin latautuminen ja alustus
- Lisätty debug-lokitus ongelmien selvittämisen helpottamiseksi
- Parannettu tekstin näkyvyyttä lisäämällä taustaväri ja reunukset

### Muutokset tiedostoittain
1. `manifest.json`:
   - Päivitetty versio 1.0.15
   - Korjattu content scriptin polku
   - Poistettu module-tyyppi background scriptiltä

2. `background.js`:
   - Yksinkertaistettu viestin käsittely
   - Lisätty debug-lokitus

3. `content.js`:
   - Siirretty oikeaan sijaintiin `src/content/content.js`
   - Lisätty tarkistus että ajetaan vain kerran
   - Parannettu tekstin näkyvyyttä
   - Lisätty kattava debug-lokitus

4. `popup/index.html`:
   - Poistettu Vue.js riippuvuus
   - Siirretty JavaScript erilliseen tiedostoon
   - Korjattu tyylit toimimaan ilman Vue.js:ää

### Seuraavat kehityskohteet
- Lisää asetuksia tekstin ulkoasulle (koko, väri, sijainti)
- Mahdollisuus tallentaa useita tekstejä
- Pikanäppäimen muokkaus
- Lokalisaatio (suomi/englanti)

### Opitut asiat
1. Chrome-laajennukset eivät salli:
   - Ulkoisia skriptejä (CDN)
   - Inline-skriptejä
   - ES moduuleja service workerissa

2. Viestintä komponenttien välillä:
   - Storage on luotettavin tapa välittää tietoa
   - Message passing vaatii että vastaanottaja on ladattu
   - Background script voi toimia koordinaattorina

3. Content script:
   - Pitää ladata oikeaan aikaan (document_end)
   - Kannattaa varmistaa että ajetaan vain kerran
   - Debug-lokitus on tärkeää ongelmien selvittämisessä 