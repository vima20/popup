# Oppimiskokemukset ja ratkaisut

## Teknisiä oppimiskokemuksia
- WebExtensions API vaatii erityisen huomion turvallisuusasetuksiin
- Vue 3 + TypeScript yhdistelmä tarjoaa hyvän tyyppitarkistuksen
- Tailwind CSS on tehokas tyylittelyyn, mutta vaatii huomiota bundle-koon kanssa
- Chrome Extension Manifest V3 vaatii erityisen huomion moduulityyppien kanssa
- Vue-komponenttien testaus vaatii huomiota event listenerien mockaamiseen ja siivomiseen
- Selainlaajennusten E2E-testaus vaatii erityisen huomion mockien ja custom-komentojen käyttöön

## Virheiden ratkaisut
### WebExtensions API
- Content script -injektio vaatii manifest.json määritykset
- Taustaskriptien ja content scriptien välinen viestintä vaatii chrome.runtime.sendMessage käytön
- Service worker vaatii "type": "module" määrityksen manifest.json tiedostossa

### Vue 3
- Komponenttien elinkaaren hallinta on kriittistä overlay-toiminnallisuudelle
- TypeScript-tyypit pitää määritellä tarkasti WebExtensions API:lle
- Vue-tiedostojen TypeScript-tuki vaatii env.d.ts määritykset
- Props vs ref: Props on parempi valinta kun arvoa halutaan hallita ulkopuolelta

### TypeScript
- Vue-tiedostojen tyypitys vaatii erillisen määritystiedoston
- Chrome Extension API:n tyypit vaativat @types/chrome paketin

### Testaus
- Event listenerien mockaaminen vaatii vi.spyOn käytön
- Mockit pitää siivota afterEach-hookissa
- Negatiiviset testit ovat tärkeitä näppäinyhdistelmien testauksessa
- DOM-elementtien mockaaminen vaatii huomiota globaaleihin objekteihin
- E2E-testauksessa custom-komentoja kannattaa käyttää yleisten toimintojen toistamiseen
- Selainlaajennusten testauksessa chrome API:n mockaaminen on välttämätöntä
- Näppäinyhdistelmien testaus vaatii erityisen huomion eventien simulointiin

## Parhaat käytännöt
1. **Koodin organisointi**
   - Selkeä hakemistorakenne
   - Modulaarinen komponenttirakenne
   - Yksikkötestit komponenteille

2. **Turvallisuus**
   - CSP (Content Security Policy) määritykset
   - Tarkka oikeuksien hallinta manifest.json:ssa
   - Input-validointi

3. **Suorituskyky**
   - Lazy loading komponenteille
   - Optimointi bundle-koon suhteen
   - Välimuistin käyttö

4. **TypeScript**
   - Tarkat tyypit kaikille komponenteille
   - Moduulien tyypitykset
   - API-tyypit

5. **Testaus**
   - Kattavat yksikkötestit
   - Mockien oikea käyttö
   - Negatiivisten testien kirjoittaminen
   - Testien siivous
   - Custom-komentojen käyttö yleisten toimintojen toistamiseen
   - Selainkohtaiset testit eri ympäristöissä

# Opitut asiat ja parhaat käytännöt

## Chrome Extension Development

### Oikeudet ja manifest.json
- Varmista oikeat `permissions` ja `host_permissions` manifest.json-tiedostossa
- Käytä manifest v3:a uusissa laajennuksissa
- Määrittele content scriptit tarkasti vain tarvittaville sivuille

### Viestintä komponenttien välillä
- Käytä Chrome Runtime Messaging API:a viestintään
- Varmista async/await-käyttö viestinnässä
- Käsittele virhetilanteet ja vastaa viesteihin

### Chrome Storage API
- Käytä `chrome.storage.sync` datan tallentamiseen
- Huomioi asynkronisuus storage-operaatioissa
- Varmista oikeudet storage-käyttöön manifestissa

### Vue.js Chrome-laajennuksessa
- Käytä Vue 3:n Composition API:a
- Huomioi Vue-sovelluksen alustus popup-ikkunassa
- Varmista tyylikirjastojen (Tailwind) toimivuus

### Virheenkorjaus
- Käytä Chrome DevTools:ia laajennuksen debuggaukseen
- Tarkista console.log-viestit background ja content scripteistä
- Testaa eri YouTube-sivuilla toimivuus 