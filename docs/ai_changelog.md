# YouTube Overlay - Muutoshistoria

## Versio 5.0 (12.3.2025)

### Merkittävät arkkitehtuurimuutokset ja parannukset

#### Background.js-tiedoston uudistukset (V5.0)
- Lisätty dynaaminen content script injektointi Chrome Scripting API:n avulla
- Parannettu välilehtien tilan seurantaa reaaliaikaisella youtubeTabsState-objektilla
- Lisätty injectContentScript-funktio, joka huolehtii sekä skriptin että tyylien injektoinnista
- Toteutettu kattava ja luotettava viestijärjestelmä popupin ja content scriptin välille
- Parannettu virheenkäsittelyä injektoinnissa ja viestinnässä
- Lisätty automaattinen content scriptin injektointi, kun YouTube-välilehti havaitaan

#### Content.js-tiedoston uudistukset (V5.0)
- Uudistettu tiedoston rakenne selkeämpään moduulimaiseen muotoon
- Toteutettu parempi overlay-elementin luonti ja hallinta
- Lisätty youtubeOverlayActive-merkki globaaliin scopeen
- Toteutettu API tilan kyselyä varten (getStatus)
- Selkeämmät ja kattavammat virhelokitukset
- Käytetty Object.assign-metodia tyylien asettamiseen
- Lisätty contentScriptReady-ilmoitus background scriptille

#### Popup.js-tiedoston uudistukset (V5.0)
- Toteutettu updateYouTubeTab-funktio, joka varmistaa content scriptin injektion ennen viestin lähetystä
- Parannettu kaikkien YouTube-välilehtien päivityslogiikkaa
- Lisätty luotettavampi virheenkäsittely ja tarkempi raportointi
- Päivitetty käyttäjäpalaute selkeämmäksi ja informatiivisemmaksi
- Selkeämmät lokiviestit helpompaan vianetsintään

#### Tiedostorakenteen uudistus (V5.0)
- Selkeä jako julkaisu- ja lähdekoodikansioiden välillä (dist/ ja src/)
- Manifest.json siirretty dist-kansioon
- Järkevämpi kuvakkeiden organisointi icons/-hakemistoon
- Päivitetty dokumentaatio vastaamaan uutta rakennetta

### Merkittävimmät korjaukset ja parannukset

#### Korjaus 1: Content Script injektointi (V5.0)
- **Ongelma**: Content script ei aina latautunut luotettavasti kaikissa tilanteissa
- **Ratkaisu**: Dynaaminen injektointi Chrome Scripting API:n avulla, joka varmistaa että content script on aina käytettävissä

#### Korjaus 2: Monivaiheinen viestintä (V5.0)
- **Ongelma**: Viestin lähetys content scriptille saattoi epäonnistua, jos script ei ollut vielä valmis
- **Ratkaisu**: Popup tarkistaa ensin content scriptin tilan, varmistaa injektion ja vasta sitten lähettää varsinaisen viestin

#### Korjaus 3: Välilehtien hallinta (V5.0)
- **Ongelma**: Välilehtien tilan seuranta ei ollut riittävän kattavaa
- **Ratkaisu**: Parannettu välilehtien tilan seuranta ja automaattinen content script injektointi

#### Parannus 1: Content Script API (V5.0)
- Lisätty uusi API content scriptin tilan kyselyyn, overlay-elementin hallintaan ja tekstin päivittämiseen
- API tarjoaa selkeät vastaukset kaikille toiminnoille, mikä helpottaa toiminnallisuuden testaamista ja laajentamista

#### Parannus 2: Automaattinen tekstin piilotus (V5.0)
- Overlay-teksti katoaa automaattisesti 3 sekunnin kuluttua näyttämisestä, mikä parantaa käyttökokemusta

#### Parannus 3: Virhelokit ja diagnostiikka (V5.0)
- Kattavampi lokitus ja virheiden raportointi, jotka helpottavat ongelmien diagnosointia

## Versio 4.0 (12.3.2025)

### Merkittävät arkkitehtuurimuutokset ja korjaukset

#### Content.js-tiedoston uudistukset (V4.0)
- Siirretty viestinkuuntelija heti skriptin alkuun, mikä varmistaa että viestit voidaan vastaanottaa ennen muita toimintoja
- Lisätty content scriptin latautumisilmoitus background scriptille
- Parannettu DOM-valmiuden seurantaa monivaiheisilla tarkistuksilla
- Lisätty kattavampi virheenkäsittely jokaiseen funktioon
- Parannettu DOM-elementtien luomislogiikkaa ja virheiden hallintaa

#### Background.js-tiedoston uudistukset (V4.0)
- Lisätty välilehtien tilan seuranta (youtubeTabsState) YouTube-välilehtien hallintaan
- Lisätty välilehtien tilan päivitysten kuuntelu (onUpdated)
- Lisätty automaattinen tekstin päivitys, kun välilehti valmistuu
- Lisätty content scriptin latautumisilmoitusten käsittely
- Parannettu virheidenkäsittelyä ja tietojen välitystä

#### Popup.js-tiedoston uudistukset (V4.0)
- Lisätty monivaiheinen päivityslogiikka, joka kokeilee useita tapoja päivittää teksti
- Parannettu virheenhallintaa kattavammilla try-catch -rakenteilla
- Lisätty viiveitä viestinvälitykseen luotettavuuden parantamiseksi
- Lisätty selkeämmät virheilmoitukset käyttäjälle

### Merkittävimmät korjaukset

#### Korjaus 1: "Receiving end does not exist" -virheen korjaus
- **Ongelma**: Popup ei pystynyt kommunikoimaan content scriptin kanssa, koska viestinkuuntelija rekisteröityi liian myöhään
- **Ratkaisu**: Viestinkuuntelija siirretty content scriptin ensimmäiseksi toiminnoksi, mikä mahdollistaa viestien vastaanottamisen välittömästi

#### Korjaus 2: Content scriptin ja background scriptin kommunikaation parantaminen
- **Ongelma**: Background script ei tiennyt milloin content script on todella latautunut
- **Ratkaisu**: Lisätty content scriptin lähettämä ilmoitus background scriptille, kun se on latautunut ja valmis vastaanottamaan viestejä

#### Korjaus 3: Monivaiheinen päivitysmekanismi
- **Ongelma**: Tekstin päivitys saattoi epäonnistua, jos yksi viestintäkanava ei toiminut
- **Ratkaisu**: Implementoitu rinnakkaisia päivityskanavia, jotka varmistavat että tieto päivittyy vaikka yksi kanava epäonnistuisi

## Versio 3.0 (11.3.2025)

### Korjaukset ja parannukset

#### Popup.js-tiedoston parannukset
- Yksinkertaistettu koodi ja parannettu rakennetta
- Lisätty selkeämmät virheilmoitukset ja logiikka
- Parannettu käyttöliittymän palautetta (napin latausanimaatio)
- Korjattu debug-napin toiminnallisuus

#### Content.js-tiedoston parannukset
- Lisätty tarkistuksia DOM-elementtien olemassaolosta
- Parannettu virheidenkäsittelyä
- Varmistettu että overlay-elementti luodaan heti kun mahdollista
- Lisätty tarkistuksia elementtien säilymisestä DOM:issa

#### Background.js-tiedoston parannukset
- Yksinkertaistettu koodi
- Parannettu virheidenkäsittelyä
- Selkeämpi logiikka callback-funktioissa

#### Manifest.json-tiedoston parannukset
- Lisätty `run_at: "document_start"` content scriptille, jotta se ladataan mahdollisimman aikaisin

#### Content.css-tiedoston korjaukset
- Päivitetty CSS-valitsin vastaamaan JavaScript-koodin ID:tä

#### README.md-tiedoston päivitykset
- Ajantasaistettu ohjeet ja tiedostorakenne
- Lisätty vianetsintäohjeet
- Päivitetty teknisen toteutuksen kuvaus

### Merkittävimmät korjaukset

#### Korjaus 1: Overlay-tekstin päivittyminen ilman sivun uudelleenlatausta
- **Ongelma**: Overlay-tekstiä ei pystynyt päivittämään ilman sivun uudelleenlatausta
- **Ratkaisu**: Lisätty kolme eri viestinvälitysmekanismia:
  1. Chrome storage listener
  2. Suorat viestit content scriptiin
  3. Background scriptin kautta kaikille välilehdille lähetettävät viestit

#### Korjaus 2: Virheiden käsittely popup-ikkunassa
- **Ongelma**: Virheistä ei tullut selkeitä ilmoituksia käyttäjälle
- **Ratkaisu**: Parannettu virheidenkäsittelyä ja lisätty selkeät tilaviestit

#### Korjaus 3: Overlay-elementin luominen ja säilyminen
- **Ongelma**: Overlay-elementti ei aina luotu oikein tai se saattoi kadota DOM:ista
- **Ratkaisu**: Lisätty parempi DOM-tarkistus, säännöllinen elementin olemassaolon varmistus

## Versio 2.0 (10.3.2025)

### Korjaukset ja parannukset
- Lisätty automaattinen päivitys kaikille YouTube-välilehdille
- Parannettu virheidenkäsittelyä
- Lisätty debug-toiminnallisuus testaamista varten

## Versio 1.0 (9.3.2025)

### Ensimmäinen toimiva versio

- Luotu perustoiminnallisuus
- Implementoitu popup-ikkuna
- Implementoitu content script
- Lisätty näppäinyhdistelmän (CTRL+SHIFT+F3) tuki

### Tunnetut ongelmat

- Overlay-tekstiä ei voi päivittää ilman sivun uudelleenlatausta
- Viestinvälitys content scriptin ja popup-ikkunan välillä on epäluotettava
- Virheidenkäsittely puutteellista 