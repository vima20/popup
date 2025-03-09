# YouTube Overlay - Frontend

## Näkymät

### Popup-ikkuna
- **Sijainti**: `src/popup/App.vue`
- **Kuvaus**: Laajennuksen pääkäyttöliittymä tekstin muokkaamiseen
- **Ominaisuudet**:
  - Tekstikenttä overlay-tekstin muokkaamiseen
  - Tallenna-painike
  - Tilanäyttö (tallennus onnistui/epäonnistui)
  - Ohjeteksti pikanäppäimestä

### Overlay-komponentti
- **Sijainti**: `src/components/Overlay.vue`
- **Kuvaus**: YouTube-videon päällä näytettävä tekstikomponentti
- **Ominaisuudet**:
  - Keskitetty sijainti videon päällä
  - Läpinäkyvä tausta
  - Selkeä kontrasti tekstille
  - Ei häiritse videon kontrolleja

## Tyylimäärittelyt

### Värit
```css
:root {
  --primary-color: #FF0000;     /* YouTube punainen */
  --text-color: #FFFFFF;        /* Valkoinen teksti */
  --bg-overlay: rgba(0,0,0,0.8); /* Läpinäkyvä tausta */
  --success-color: #4CAF50;     /* Vihreä onnistumisille */
  --error-color: #F44336;       /* Punainen virheille */
}
```

### Typografia
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

.overlay-text {
  font-size: 24px;
  font-weight: 600;
}
```

### Komponenttien tyylit

#### Popup
```css
.popup {
  width: 300px;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.button {
  width: 100%;
  padding: 8px;
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
}
```

#### Overlay
```css
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-overlay);
  color: var(--text-color);
  padding: 20px;
  border-radius: 8px;
  pointer-events: none;
  z-index: 999999;
}
```

## Käyttöliittymän periaatteet

1. **Yksinkertaisuus**
   - Minimalistinen design
   - Selkeät toiminnot
   - Ei ylimääräisiä elementtejä

2. **Saavutettavuus**
   - Riittävä kontrasti
   - Selkeä typografia
   - Näppäimistökäyttö

3. **Palaute**
   - Visuaalinen palaute toiminnoista
   - Selkeät virheilmoitukset
   - Latausanimaatiot tarvittaessa

4. **Responsiivisuus**
   - Overlay skaalautuu videon koon mukaan
   - Popup toimii eri näyttöko'oilla 