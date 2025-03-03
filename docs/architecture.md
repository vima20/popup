# Tekninen arkkitehtuuri

## Tekninen pino
- **Frontend Framework**: Vue 3
- **Kieli**: TypeScript
- **UI Kirjasto**: Tailwind CSS
- **Testaus**: 
  - Yksikkötestit: Jest + Vue Test Utils
  - E2E-testit: Cypress
- **Laajennus**: Chrome/Firefox WebExtensions API

## Hakemistorakenne
```
src/
├── components/         # Vue-komponentit
├── content/           # Laajennuksen sisältöskriptit
├── background/        # Taustaskriptit
├── popup/            # Laajennuksen popup-ikkuna
├── utils/            # Apufunktiot
└── types/            # TypeScript-tyypit

tests/
├── unit/             # Yksikkötestit
└── e2e/              # E2E-testit

docs/                 # Dokumentaatio
```

## Komponentit
1. **OverlayComponent**
   - Näyttää "Hello world!" -tekstin
   - Hallinnoi näkyvyyttä
   - Käsittelee näppäinyhdistelmät

2. **ContentScript**
   - Injektio YouTube-sivuille
   - Näppäinyhdistelmän kuuntelu
   - Vue-sovelluksen alustus

3. **BackgroundScript**
   - Laajennuksen elinkaaren hallinta
   - Viestien välitys komponenttien välillä

## Testausstrategia
- Yksikkötestit: Komponenttien ja apufunktioiden testaus
- E2E-testit: Käyttäjätapausten testaus selaimessa
- Integraatiotestit: Komponenttien välinen vuorovaikutus 