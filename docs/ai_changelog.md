# Muutosloki

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