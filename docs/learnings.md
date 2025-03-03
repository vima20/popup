# Oppimiskokemukset ja ratkaisut

## Teknisiä oppimiskokemuksia
- WebExtensions API vaatii erityisen huomion turvallisuusasetuksiin
- Vue 3 + TypeScript yhdistelmä tarjoaa hyvän tyyppitarkistuksen
- Tailwind CSS on tehokas tyylittelyyn, mutta vaatii huomiota bundle-koon kanssa
- Chrome Extension Manifest V3 vaatii erityisen huomion moduulityyppien kanssa
- Vue-komponenttien testaus vaatii huomiota event listenerien mockaamiseen ja siivomiseen

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