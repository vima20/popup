# YouTube Overlay -laajennus

Yksinkertainen Chrome-laajennus, joka näyttää mukautettavan tekstin YouTube-videoiden päällä.

## Ominaisuudet

- Näyttää käyttäjän määrittämän tekstin YouTube-videoiden päällä
- Aktivoidaan näppäinyhdistelmällä CTRL+SHIFT+F3
- Teksti tallennetaan ja säilyy sivun uudelleenlatausten välillä
- Teksti päivittyy automaattisesti kaikissa avoimissa YouTube-välilehdissä
- Yksinkertainen ja kevyt - ei ulkoisia riippuvuuksia

## Asennus

### Kehitysympäristössä

1. Kloonaa tai lataa tämä repositorio
2. Avaa Chrome-selain ja mene osoitteeseen `chrome://extensions/`
3. Ota käyttöön "Developer mode" (oikeassa yläkulmassa)
4. Klikkaa "Load unpacked" ja valitse projektin kansio
5. Laajennus on nyt asennettu

### Päivitys

Jos päivität laajennusta:

1. Mene `chrome://extensions/`
2. Etsi YouTube Overlay -laajennus ja paina "Päivitä"-kuvaketta (pyöreä nuoli)
3. Vaihtoehtoisesti voit myös poistaa laajennuksen ja asentaa sen uudelleen

### Julkaisu Chrome Web Storeen (valinnainen)

Tämän laajennuksen voi myös pakata ja julkaista Chrome Web Storessa:

1. Mene `chrome://extensions/`
2. Ota käyttöön "Developer mode"
3. Klikkaa "Pack extension" ja valitse projektin kansio
4. Tämä luo .crx-tiedoston, jonka voit lähettää Chrome Web Storeen

## Käyttö

1. Mene YouTube-sivulle
2. Klikkaa laajennuksen kuvaketta selaimen työkalupalkissa
3. Kirjoita haluamasi teksti tekstikenttään
4. Paina "Tallenna"-painiketta
5. Paina CTRL+SHIFT+F3 näyttääksesi/piilottaaksesi tekstin

### Vianetsintä

Jos overlay ei toimi tai tekstin päivitys ei näy:

1. Varmista että olet YouTube-sivulla
2. Kokeile päivittää YouTube-sivu (F5)
3. Tarkista laajennuksen popup-ikkunasta virheviestit
4. Kokeile "Testaa päivitys"-nappia, joka lähettää testiviestin
5. Avaa selaimen konsoli (F12 > Console) ja katso mahdolliset virheviestit

## Tiedostorakenne

```
youtube-overlay/
│
├── icon16.png                  # Laajennuksen pieni kuvake
├── icon48.png                  # Laajennuksen keskikokoinen kuvake
├── icon128.png                 # Laajennuksen suuri kuvake
│
├── background.js               # Taustaprosessi
├── content.js                  # YouTube-sivulle injektoitava skripti
├── content.css                 # YouTube-sivulle injektoitavat tyylit
├── popup.html                  # Popup-ikkunan HTML
├── popup.js                    # Popup-ikkunan toiminnallisuus
│
├── .gitignore                  # Git-versionhallinnan ohitustiedosto
├── manifest.json               # Laajennuksen määrittelytiedosto
├── package.json                # Projektin metatiedot
└── README.md                   # Tämä dokumentaatiotiedosto
```

## Tekninen toteutus

Laajennus on toteutettu käyttäen puhdasta JavaScriptiä ilman ulkoisia riippuvuuksia. Toimintaperiaate:

1. **background.js** alustaa laajennuksen, tallentaa oletustekstin ja välittää viestejä eri YouTube-välilehtien välillä
2. **content.js** luo overlay-elementin YouTube-sivulle ja hallitsee sen näkyvyyttä ja tekstiä
3. **popup.js** mahdollistaa tekstin muokkaamisen ja tallentamisen kaikille YouTube-välilehdille
4. **content.css** määrittelee tyylit overlay-elementille

### Viestinvälitys

Laajennuksessa on käytössä kolme eri viestinvälitysmekanismia:

1. **Chrome storage** - Tallentaa tekstin ja mahdollistaa automaattisen päivityksen
2. **Suorat viestit** - Popup lähettää viestin suoraan aktiiviseen välilehteen
3. **Background-skriptin välitys** - Päivittää kaikki avoinna olevat YouTube-välilehdet

## Lisenssi

MIT 