# Video Overlay - Muutoshistoria

## Versio 6.1.0 - Manual Control (2024-03-13)
- Lisätty käyttäjän täysi kontrolli tekstin näkyvyyteen (ei automaattista piilotusta)
- Parannettu URL-tarkistusta (vain http/https-protokollat sallittu)
- Korjattu ristiriita injektoidun skriptin ja content.js-tiedoston välillä
- Päivitetty versiotiedot selkeämmäksi (version_name)
- Päivitetty laajennuksen nimi ja kuvaus
- Parannettu popup-ikkunan käytettävyyttä lisäämällä versiotiedot

## Versio 6.0 (2024-03-19)
- Laajennettu toiminnallisuus tukemaan kaikkia videostriimejä
- Poistettu YouTube-spesifiset rajoitukset
- Päivitetty dokumentaatio vastaamaan yleisempiä käyttötarkoituksia
- Testattu toimivuus eri videostriimipalveluilla

## Versio 5.0 (2024-03-19)
- Lisätty dynaaminen skriptin injektointi
- Parannettu virheenkäsittelyä
- Lisätty videoOverlayActive-merkki globaaliin scopeen
- Päivitetty dokumentaatio

## Versio 4.0 (12.3.2025)

### Merkittävät arkkitehtuurimuutokset ja korjaukset

#### Content.js-tiedoston uudistukset (V4.0)
- Siirretty viestinkuuntelija heti skriptin alkuun, mikä varmistaa että viestit voidaan vastaanottaa ennen muita toimintoja
- Lisätty content scriptin latautumisilmoitus background scriptille
- Parannettu DOM-valmiuden seurantaa monivaiheisilla tarkistuksilla
- Lisätty kattavampi virheenkäsittely jokaiseen funktioon
- Parannettu DOM-elementtien luomislogiikkaa ja virheiden hallintaa

#### Background.js-tiedoston uudistukset (V4.0)
- Lisätty välilehtien tilan seuranta (videoTabsState) video-välilehtien hallintaan
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
- Lisätty automaattinen päivitys kaikille video-välilehdille
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

# AI Changelog

## 2024-03-11
- Siirretty projekti GitHub-repositorioon
- Päivitetty dokumentaatio vastaamaan versiota 5.0
- Lisätty dynaaminen content script injektointi
- Korjattu merkistökoodausongelmat
- Siivottu projektin tiedostorakenne

## Seuraavat vaiheet (2024-03-12)
- Laajennetaan overlay toimimaan kaikilla videostriimeillä:
  - Universaali toteutus kaikille videostriimeille
  - Ei palvelukohtaisia konfiguraatioita
  - Yhtenäinen käyttökokemus kaikilla sivustoilla
  - Testataan toimivuus eri striimauspalveluissa 