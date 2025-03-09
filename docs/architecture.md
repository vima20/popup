# Tekninen arkkitehtuuri

## Teknologiapino

- Frontend Framework: Vue 3
- Tyylittely: Tailwind CSS
- Ohjelmointikieli: TypeScript/JavaScript
- Selainlaajennuksen API: Chrome Extension API v3

## Kansiorakenne

```
/
├── manifest.json           # Laajennuksen määrittelytiedosto
├── src/
│   ├── popup/             # Popup-ikkunan Vue-komponentit
│   │   ├── App.vue        # Päänäkymä
│   │   └── popup.html     # HTML-pohja
│   ├── content.js         # Sisältöskripti YouTube-sivuille
│   └── background.js      # Taustapalvelu
```

## Komponentit

1. **Popup (App.vue)**
   - Käyttöliittymä tekstin muokkaamiseen
   - Kommunikoi content scriptin kanssa
   - Käyttää Chrome Storage API:a tallennukseen

2. **Content Script (content.js)**
   - Luo ja hallinnoi overlay-elementtiä
   - Kuuntelee näppäinkomentoja
   - Kommunikoi popup-komponentin kanssa

3. **Background Service (background.js)**
   - Hallinnoi laajennuksen elinkaarta
   - Käsittelee tapahtumia

## Tietovirrat

1. Käyttäjä muokkaa tekstiä popup-ikkunassa
2. Teksti tallennetaan Chrome Storage API:iin
3. Content script hakee tekstin storage:sta
4. Overlay päivittyy YouTube-sivulla

## Testausstrategia
- Yksikkötestit: Komponenttien ja apufunktioiden testaus
- E2E-testit: Käyttäjätapausten testaus selaimessa
- Integraatiotestit: Komponenttien välinen vuorovaikutus 