# YouTube Overlay - Chrome Extension

Chrome-laajennus, joka näyttää "Hello world" eli muokattavan tekstin YouTube-videoiden päällä kun painetaan CTRL + SHIFT + F3.

## Ominaisuudet

- Näyttää muokattavan tekstin YouTube-videoiden päällä
- Pikanäppäin: CTRL + SHIFT + F3
- Teksti tallentuu automaattisesti
- Tyylikkäät animaatiot
- Responsiivinen suunnittelu

## Asennus

1. Lataa laajennuksen tiedostot
2. Avaa Chrome ja mene osoitteeseen `chrome://extensions/`
3. Ota käyttöön "Developer mode" (Kehittäjätila)
4. Klikkaa "Load unpacked" (Lataa pakkaamaton) ja valitse laajennuksen `dist`-kansio

## Käyttö

1. Avaa YouTube-video
2. Klikkaa laajennuksen ikonia oikeassa yläkulmassa
3. Kirjoita haluamasi teksti
4. Paina "Tallenna"
5. Käytä CTRL + SHIFT + F3 näppäinyhdistelmää tekstin näyttämiseen/piilottamiseen

## Kehitysympäristön pystytys

### Edellytykset

- Node.js (v16 tai uudempi)
- npm tai yarn
- Cursor IDE (suositeltu)

### Mikä on Cursor?

Cursor on moderni koodieditori, joka yhdistää tekoälyn ja koodin kirjoittamisen. Se on suunniteltu erityisesti kehittäjille, jotka haluavat tehostaa työtään tekoälyn avulla. Cursor käyttää edistyneitä kielimalleja (kuten GPT-4) tarjotakseen:

- **Älykäs koodin täydennys**: Cursor ymmärtää kontekstin ja ehdottaa relevantteja koodinpätkiä
- **Koodin selitykset**: Valitun koodin toiminnan selittäminen selkeästi
- **Virheiden korjaus**: Automaattiset ehdotukset virheiden korjaamiseen
- **Dokumentaation generointi**: Automaattinen dokumentaation luominen koodista
- **Koodin refaktorointi**: Älykkäät ehdotukset koodin parantamiseen
- **Git-integraatio**: Suora integraatio versionhallintaan

Cursor eroaa perinteisistä koodieditoreista (kuten VS Code) siinä, että se on suunniteltu erityisesti tekoälyn hyödyntämiseen koodin kirjoittamisessa. Se ei ole pelkkä editori, vaan aktiivinen koodausavustaja, joka ymmärtää projektin kontekstin ja auttaa kehittäjää tehokkaammin.

### Cursor IDE

Cursor on tekoälyavusteinen koodieditori, joka auttaa koodin kirjoittamisessa ja ymmärtämisessä. Tässä projektissa käytämme Cursoria seuraavasti:

1. **Cursorin asennus**
   - Lataa Cursor osoitteesta https://cursor.sh
   - Asenna sovellus
   - Kirjaudu sisään GitHub-tilillä

2. **Projektin avaaminen**
   - Avaa Cursor
   - Valitse "Open Folder" (Avaa kansio)
   - Valitse projektin kansio

3. **Cursorin ominaisuudet**
   - Tekoälyavusteinen koodin kirjoitus
   - Automaattinen koodin täydennys
   - Koodin selitykset ja dokumentaatio
   - Virheiden korjausehdotukset
   - Git-integraatio

4. **Hyödylliset pikanäppäimet**
   - `Ctrl + K`: Avaa tekoälyavusteinen komentorivi
   - `Ctrl + L`: Selitä valittu koodi
   - `Ctrl + I`: Korjaa virheet
   - `Ctrl + Shift + L`: Lisää lokitus

5. **Parhaat käytännöt**
   - Käytä tekoälyä apuna koodin kirjoittamisessa
   - Tarkista tekoälyn ehdottamat muutokset ennen hyväksymistä
   - Käytä kommentteja selittämään monimutkaista logiikkaa
   - Hyödynnä Cursorin dokumentaatiogeneraatiota

### Projektin asennus

```bash
# Asenna riippuvuudet
npm install

# Käynnistä kehityspalvelin
npm run dev

# Rakenna tuotantoversio
npm run build
```

### Testaus

```bash
# Suorita yksikkötestit
npm run test:unit

# Suorita E2E-testit
npm run test:e2e
```

## Tekninen dokumentaatio

- [Sovelluksen kuvaus](docs/description.md)
- [Tekninen arkkitehtuuri](docs/architecture.md)
- [Käyttöliittymän dokumentaatio](docs/frontend.md)
- [Tietomalli](docs/datamodel.md)
- [Backend-dokumentaatio](docs/backend.md)
- [Tehtävälista](docs/todo.md)
- [Muutosloki](docs/ai_changelog.md)
- [Oppimiskokemukset](docs/learnings.md)

## Lisenssi

MIT 
