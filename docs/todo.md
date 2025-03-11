# YouTube Overlay - Tehtävälista

## Ominaisuudet

### Ydinominaisuudet

- [✅] Overlay-elementin luominen ja näyttäminen YouTube-videoissa
- [✅] Näppäinyhdistelmä (CTRL+SHIFT+F3) elementin näyttämiseen
- [✅] Käyttäjän määrittelemän tekstin syöttäminen popup-ikkunassa
- [✅] Tekstin tallentaminen Chrome storage -rajapinnan avulla
- [✅] Automaattinen tekstin päivitys kaikille avoimille YouTube-välilehdille
- [✅] Virheidenkäsittely ja käyttäjäpalaute
- [✅] Popup-ikkunan käyttöliittymä
- [✅] Automaattinen overlay-piilotus 3 sekunnin kuluttua

### Parannukset ja kehitysideat

- [⏳] Useamman tekstin tallentaminen ja valitseminen
- [❌] Tekstin ulkoasun mukauttaminen (fontti, koko, väri)
- [❌] Tekstin sijainnin säätäminen videolla
- [❌] Animaatioiden ja tehosteiden lisääminen
- [❌] Ajastettu näyttäminen/piilottaminen
- [❌] Tekstin tallentaminen tietyille videoille (per-video-setting)
- [❌] Tuki kuvien ja emojien lisäämiselle

## Tekninen kehitys

- [✅] Manifest V3 yhteensopivuus
- [✅] Content scriptin lataaminen document_start-vaiheessa
- [✅] Luotettava viestinvälitys komponenttien välillä
- [✅] Storage-muutosten kuuntelu
- [✅] Viestikuuntelijan optimoitu sijoitus content scriptissä
- [✅] Content scriptin latautumisilmoitukset background scriptille
- [✅] Monivaiheinen viestintäjärjestelmä virheiden estämiseksi
- [✅] Välilehtien tilan seuranta
- [✅] Dynaaminen content scriptin injektointi Chrome Scripting API:lla (V5.0)
- [✅] API content scriptin tilan kyselyyn (V5.0)
- [✅] Selkeämpi moduulirakenne ja parannetut virhelokitukset (V5.0)
- [✅] Tiedostorakenteen organisointi ja dist-hakemisto (V5.0)
- [⏳] Suorituskyvyn optimointi
- [⏳] Koodin refaktorointi ja organisointi
- [❌] Yksikkötestien lisääminen
- [❌] TypeScript-migraatio
- [❌] Build-prosessin luominen (src → dist)

## Käyttöliittymä

- [✅] Popup-ikkunan perustyylitys
- [✅] Overlay-elementin tyylit
- [✅] Tilaviestit käyttäjälle
- [✅] Debug-ominaisuudet kehittäjille
- [❌] Asetussivu lisäasetuksille
- [❌] Tumma teema popup-ikkunalle
- [❌] Responsiivisuuden parantaminen erilaisille näyttökoille

## Dokumentaatio

- [✅] README.md perustiedoilla
- [✅] Arkkitehtuuri- ja tekninen dokumentaatio
- [✅] Käyttöliittymädokumentaatio
- [✅] Versiohistoria ja muutosloki
- [✅] Vianetsintäopas (V5.0)
- [❌] Käyttöohjeet loppukäyttäjille
- [❌] Koodikommentit ja JSDocs

## Jakelu

- [✅] Toimiva kehitysversion paketointi
- [❌] Chrome Web Store -julkaisu
- [❌] Firefox-version luominen
- [❌] Edge-version luominen
- [❌] Versiointijärjestelmä

## Valmistuneet ominaisuudet (V5.0)

- [✅] Dynaaminen content scriptin injektointi Chrome Scripting API:lla
- [✅] Monivaiheinen viestintä popup → background → content script
- [✅] Content scriptin tila-API ja tilakyselyt
- [✅] Selkeämmät ja kattavammat lokiviestit
- [✅] Tiedostorakenteen uudelleenorganisointi (dist/src)
- [✅] Päivitetty dokumentaatio

## Seuraavat prioriteetit

1. Build-prosessin luominen (src → dist automaattinen koonti)
2. TypeScript-migraatio paremman tyyppitarkistuksen vuoksi
3. Asetussivu lisäasetuksille (ulkoasun mukauttaminen)
4. Useamman tekstin tallentaminen ja valitseminen
5. Chrome Web Store -julkaisu 