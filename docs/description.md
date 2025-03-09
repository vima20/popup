# YouTube Overlay - Kuvaus

## Idea
YouTube Overlay on Chrome-laajennus, joka mahdollistaa mukautettavan tekstin näyttämisen YouTube-videoiden päällä. Käyttäjä voi aktivoida tekstin näkyvyyden pikanäppäimellä ja muokata tekstiä laajennuksen popup-ikkunasta.

## Ydinominaisuudet
1. **Tekstin näyttäminen**
   - Teksti näytetään videon päällä keskellä ruutua
   - Teksti ei häiritse videon kontrolleja tai muita elementtejä
   - Teksti on aina luettavissa videon päällä (kontrastit huomioitu)

2. **Tekstin hallinta**
   - Teksti voidaan näyttää/piilottaa pikanäppäimellä (CTRL + SHIFT + F3)
   - Tekstiä voi muokata laajennuksen popup-ikkunasta
   - Teksti tallennetaan selaimen muistiin

3. **Käyttöliittymä**
   - Yksinkertainen ja selkeä popup-ikkuna tekstin muokkaamiseen
   - Visuaalinen palaute tekstin tallennuksesta
   - Ohjeteksti pikanäppäimen käytöstä

## Käyttötapaukset
1. **Muistiinpanot**
   - Käyttäjä voi näyttää muistiinpanoja katsoessaan opetusvideota
   - Muistiinpanot pysyvät tallessa selaimen muistissa

2. **Muistutukset**
   - Käyttäjä voi asettaa muistutuksia näkyviin videon päälle
   - Muistutukset voi helposti piilottaa pikanäppäimellä

3. **Merkinnät**
   - Käyttäjä voi merkitä tärkeitä kohtia videosta
   - Merkinnät säilyvät selaimen välillä

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