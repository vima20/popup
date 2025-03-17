# Video Overlay Laajennus

## Kuvaus
Chrome-laajennus, joka näyttää ohjaajan viestin videon päällä kun painat CTRL+SHIFT+9. Laajennus on suunniteltu erityisesti videoiden ohjausta varten.

## Käyttötapaukset
1. Ohjaaja kirjoittaa viestin sivulle elementtiin, jonka id on "director-message"
2. Kun ohjaaja haluaa näyttää viestin, painaa CTRL+SHIFT+9
3. Viesti näkyy videon päällä 5 sekuntia
4. Viesti voi olla mikä tahansa teksti, joka on kirjoitettu sivulle

## Tekninen toteutus
- Laajennus käyttää Chrome Extension Manifest V3
- Content script injektoidaan sivulle ja se etsii elementin, jonka id on "director-message"
- Viesti näytetään overlay-elementtinä sivun yläosassa
- Overlay-elementti on tyylitelty tummalla taustalla ja valkoisella tekstillä
- Viesti näkyy 5 sekuntia ja katoaa automaattisesti

## Kehitysympäristö
- Node.js
- Vite
- TypeScript
- Chrome Extension APIs

## Testaus
1. Avaa testi.html sivusto
2. Kirjoita viesti elementtiin, jonka id on "director-message"
3. Paina CTRL+SHIFT+9
4. Viestin pitäisi näkyä videon päällä 5 sekuntia 