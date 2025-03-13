# Video Overlay -laajennus

Yksinkertainen Chrome-laajennus, joka näyttää mukautettavan tekstin YouTube-videoiden päällä.

## Ominaisuudet

- Näyttää käyttäjän määrittämän tekstin YouTube-videoiden päällä
- Aktivoidaan näppäinyhdistelmällä CTRL+SHIFT+F3
- Käyttäjän täysi kontrolli tekstin näkyvyyteen hotkeyn avulla (Manual Control)
- Teksti tallennetaan ja säilyy sivun uudelleenlatausten välillä
- Teksti päivittyy automaattisesti kaikissa avoimissa YouTube-välilehdissä
- Yksinkertainen ja kevyt - ei ulkoisia riippuvuuksia
- Luotettava viestintäjärjestelmä eri komponenttien välillä
- Automaattinen content scriptin tilan seuranta
- Dynaaminen content scriptin injektointi
- Parannettu vikasietoisuus ja virheidenkäsittely
- Toimii vain turvallisilla http/https-protokollan sivustoilla

## Asennus

### Kehitysympäristössä

1. Kloonaa tai lataa tämä repositorio
2. Avaa Chrome-selain ja mene osoitteeseen `chrome://extensions/`
3. Ota käyttöön "Developer mode" (oikeassa yläkulmassa)
4. Klikkaa "Load unpacked" ja valitse projektin `dist`-kansio
5. Laajennus on nyt asennettu

### Päivitys

Jos päivität laajennusta:

1. Mene `chrome://extensions/`
2. Etsi Video Overlay -laajennus ja paina "Päivitä"-kuvaketta (pyöreä nuoli)
3. Vaihtoehtoisesti voit myös poistaa laajennuksen ja asentaa sen uudelleen kokonaan

### Julkaisu Chrome Web Storeen (valinnainen)

Tämän laajennuksen voi myös pakata ja julkaista Chrome Web Storessa:

1. Mene `chrome://extensions/`
2. Ota käyttöön "Developer mode"
3. Klikkaa "Pack extension" ja valitse projektin `dist`-kansio
4. Tämä luo .crx-tiedoston, jonka voit lähettää Chrome Web Storeen

## Käyttö

1. Mene YouTube-sivulle
2. Klikkaa laajennuksen kuvaketta selaimen työkalupalkissa
3. Kirjoita haluamasi teksti tekstikenttään
4. Paina "Tallenna"-painiketta
5. Paina CTRL+SHIFT+F3 näyttääksesi tekstin YouTube-sivulla
6. Paina CTRL+SHIFT+F3 uudelleen piilottaaksesi tekstin

### Vianetsintä

Jos overlay ei toimi tai tekstin päivitys ei näy:

1. Varmista että olet YouTube-sivulla tai muulla http/https-sivustolla
2. Kokeile päivittää YouTube-sivu (F5)
3. Tarkista laajennuksen popup-ikkunasta virheviestit
4. Kokeile "Testaa päivitys"-nappia, joka lähettää testiviestin
5. Jos testi epäonnistuu, sulje kaikki YouTube-välilehdet ja avaa uusi, yritä sitten uudelleen
6. Avaa selaimen konsoli (F12 > Console) ja katso mahdolliset virheviestit
7. Varmista että laajennus on päivitetty uusimpaan versioon (V6.1.0)

## Tiedostorakenne

```
video-overlay/
│
├── dist/                       # Julkaisukansio
│   ├── icons/                  # Kuvakekansio
│   │   ├── icon16.png          # Laajennuksen pieni kuvake
│   │   ├── icon48.png          # Laajennuksen keskikokoinen kuvake
│   │   └── icon128.png         # Laajennuksen suuri kuvake
│   │
│   ├── background.js           # Taustaprosessi
│   ├── popup.html              # Popup-ikkunan HTML
│   ├── popup.js                # Popup-ikkunan toiminnallisuus
│   └── manifest.json           # Laajennuksen määrittelytiedosto
│
├── docs/                       # Dokumentaatio
│   ├── images/                 # Dokumentaation kuvat
│   ├── readme.md               # Yksityiskohtainen dokumentaatio
│   └── ...                     # Muut dokumentaatiotiedostot
│
├── .gitignore                  # Git-versionhallinnan ohitustiedosto
├── package.json                # Projektin metatiedot
├── build.js                    # Build-skripti
└── README.md                   # Tämä dokumentaatiotiedosto
```

## Tekninen toteutus

Laajennus on toteutettu käyttäen puhdasta JavaScriptiä ilman ulkoisia riippuvuuksia. Toimintaperiaate:

1. **background.js** alustaa laajennuksen, tarkkailee välilehtien tilaa, injektoi content scriptin dynaamisesti ja hallinnoi viestintää eri komponenttien välillä
2. **injektoitu content script** luo overlay-elementin sivulle, kuuntelee näppäinkomentoja, käsittelee viestejä ja hallitsee elementin näkyvyyttä ja tekstiä
3. **popup.js** mahdollistaa tekstin muokkaamisen, tallentamisen ja testaamisen, varmistaa content scriptin injektion ja välittää päivityskomennot

### Viestinvälitys

Laajennuksessa on käytössä kehittyneet viestinvälitysmekanismit:

1. **Chrome storage** - Tallentaa tekstin ja mahdollistaa automaattisen päivityksen
2. **Dynaaminen injektointi** - Background script injektoi content scriptin tarvittaessa
3. **Monivaiheinen viestintä** - Popup varmistaa ensin content scriptin injektion ja sitten lähettää viestin
4. **Välilehtien tilan seuranta** - Background script ylläpitää reaaliaikaista tilaa kaikista välilehdistä
5. **Luotettava vastausjärjestelmä** - Kaikki viestit varmistavat vastauksen ja käsittelevät virhetilanteet
6. **Content scriptin tila** - Content script ilmoittaa tilastaan ja tarjoaa API:n tilan kyselyyn

## Versiohistoria

### V6.1.0 - Manual Control (Nykyinen)
- Käyttäjän täysi kontrolli tekstin näkyvyyteen (ei automaattista piilotusta)
- Toimii vain turvallisilla http/https-protokollan sivustoilla
- Parannettu virhetilanteiden käsittelyä
- Lisätty selkeä versiointi

### V6.0
- Toimii kaikilla video-sivustoilla
- Parannettu virhetilanteiden käsittelyä

### V5.0
- Lisätty dynaaminen content scriptin injektointi
- Parannettu luotettavuutta monivaiheisella viestinnällä
- Uudistettu viestintäjärjestelmä popup, background ja content scriptien välillä
- Lisätty API content scriptin tilan kyselyyn
- Parannettu virhetilanteiden käsittelyä kaikissa komponenteissa
- Selkeämmät lokiviestit helpompaan vianetsintään
- Päivitetty tiedostorakenne erottamaan lähdekoodi ja julkaisu

### V4.0
- Parannettu luotettavuutta siirtämällä viestinkuuntelija content scriptin alkuun
- Lisätty välilehtien tilan seuranta background scriptiin
- Lisätty content scriptin latautumisilmoitus
- Parannettu virheenkäsittelyä kaikissa komponenteissa
- Lisätty monivaiheinen päivityslogiikka

### V3.0
- Yksinkertaistettu content scriptin alustuslogiikkaa
- Parannettu DOM-valmiuden seurantaa
- Lisätty säännöllinen overlay-elementin tarkistus

### V2.0 
- Lisätty automaattinen päivitys kaikille YouTube-välilehdille
- Parannettu virheidenkäsittelyä
- Lisätty debug-toiminnallisuus

### V1.0
- Ensimmäinen versio perustoiminnallisuuksilla

## Lisenssi

MIT 