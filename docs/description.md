# YouTube Overlay Extension

Selainlaajennus, joka mahdollistaa mukautetun tekstin näyttämisen YouTube-videoiden päällä. 

## Ydintoiminnallisuudet

- Mukautetun tekstin asettaminen popup-ikkunan kautta
- Tekstin näyttäminen/piilottaminen näppäinyhdistelmällä (CTRL + SHIFT + F3)
- Tekstin tallennus selaimen muistiin
- Toimii kaikilla YouTube-sivuilla

## Käyttötapaukset

1. Käyttäjä haluaa lisätä muistiinpanoja tai kommentteja videon päälle
2. Käyttäjä haluaa merkitä tärkeitä kohtia videosta
3. Käyttäjä haluaa lisätä omia käännöksiä tai selityksiä videon sisältöön

## Kuvaus
Tämä projekti on selainlaajennus, joka näyttää "Hello world!" -tekstin YouTube-videoiden päällä kun käyttäjä painaa "CTRL + SHIFT + F3" -näppäinyhdistelmää. Teksti poistuu näkyvistä kun käyttäjä painaa näppäinyhdistelmää uudestaan. Tekstiä voi muokata laajennuksen popup-ikkunasta.

## Ominaisuudet
- Overlay-komponentin luominen ja hallinta
- Näppäinyhdistelmän (CTRL + SHIFT + F3) käsittely tekstin näyttämiseen ja piilottamiseen
- Chrome Extension API:n käyttö
- Vue 3 -komponenttien käyttö
- Tailwind CSS -tyylit
- Mukautettavan tekstin tallennus
- Tila-indikaattori popup-ikkunassa

## Käyttöliittymä
1. Käyttäjä avaa YouTube-videon
2. Laajennus latautuu automaattisesti
3. Käyttäjä painaa CTRL + SHIFT + F3 -näppäinyhdistelmää
4. "Hello world!" -teksti ilmestyy videon päälle
5. Käyttäjä painaa CTRL + SHIFT + F3 -näppäinyhdistelmää uudestaan
6. Teksti poistuu näkyvistä

## Tekstin muokkaus
1. Käyttäjä avaa laajennuksen popup-ikkunan
2. Syöttää haluamansa tekstin syöttökenttään
3. Painaa "Save"-painiketta
4. Teksti päivittyy overlay-ikkunaan 