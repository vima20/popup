# Käyttöliittymä

## Näkymät
1. **Overlay-näkymä**
   - Yksinkertainen "Hello world!" -teksti
   - Puoliläpinäkyvä tausta
   - Keskitetty sijainti videon päällä
   - Animoidut siirtymät näkyviin/piiloon

## UI/UX-kuvaus
- **Tyylit**: Tailwind CSS
- **Teemat**: 
  - Vaalea teema (oletus)
  - Tumma teema (vaihtoehto)
- **Animaatiot**:
  - Fade-in/fade-out efektit
  - Pehmeät siirtymät

## Komponentit
1. **OverlayComponent**
   ```vue
   <template>
     <div class="overlay" :class="{ 'overlay--visible': isVisible }">
       <div class="overlay__content">
         Hello world!
       </div>
     </div>
   </template>
   ```

2. **PopupComponent**
   - Laajennuksen asetukset
   - Tila-indikaattori
   - Näppäinyhdistelmän muokkaus

## Näppäinyhdistelmät
- CTRL + F3: Näytä/piilota overlay
- ESC: Piilota overlay (vaihtoehto) 