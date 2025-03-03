# YouTube Overlay Extension

## Kuvaus
Tämä on selainlaajennus, joka näyttää "Hello world!" -tekstin YouTube-videoiden päällä kun käyttäjä painaa "CTRL + F3" -näppäinyhdistelmää.

## Teknologiat
- Frontend: Vue 3 + TypeScript
- UI: Tailwind CSS
- Testaus: Jest (yksikkötestit) ja Cypress (e2e-testit)
- Laajennus: Chrome/Firefox WebExtensions API

## Asennus
1. Kloonaa repositorio
2. Asenna riippuvuudet: `npm install`
3. Käynnistä kehitysympäristö: `npm run dev`
4. Lataa laajennus selaimelle:
   - Chrome: Avaa chrome://extensions/
   - Firefox: Avaa about:debugging

## Kehitys
- `npm run dev`: Käynnistä kehitysympäristö
- `npm run build`: Rakenna tuotantoversio
- `npm run test`: Suorita testit
- `npm run test:e2e`: Suorita e2e-testit

## Lisenssi
MIT 