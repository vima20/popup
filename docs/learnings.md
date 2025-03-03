# Oppimiskokemukset ja ratkaisut

## Teknisiä oppimiskokemuksia
- WebExtensions API vaatii erityisen huomion turvallisuusasetuksiin
- Vue 3 + TypeScript yhdistelmä tarjoaa hyvän tyyppitarkistuksen
- Tailwind CSS on tehokas tyylittelyyn, mutta vaatii huomiota bundle-koon kanssa

## Virheiden ratkaisut
### WebExtensions API
- Content script -injektio vaatii manifest.json määritykset
- Taustaskriptien ja content scriptien välinen viestintä vaatii chrome.runtime.sendMessage käytön

### Vue 3
- Komponenttien elinkaaren hallinta on kriittistä overlay-toiminnallisuudelle
- TypeScript-tyypit pitää määritellä tarkasti WebExtensions API:lle

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