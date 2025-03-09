# Käyttöliittymä

## Näkymät
1. **Overlay-näkymä**
   - Yksinkertainen "Hello world!" -teksti (muokattavissa)
   - Puoliläpinäkyvä tausta (bg-black/50)
   - Keskitetty sijainti videon päällä
   - Animoidut siirtymät näkyviin/piiloon
   - CTRL + SHIFT + F3 näppäinyhdistelmä näyttämiseen/piilottamiseen

2. **Popup-näkymä**
   - Laajennuksen asetukset
   - Tila-indikaattori (näkyvä/piilotettu)
   - Mukautettavan tekstin syöttökenttä
   - Tallennuspainike
   - Näppäinyhdistelmän ohjeet

## UI/UX-kuvaus
- **Tyylit**: Tailwind CSS
- **Teemat**: 
  - Vaalea teema (oletus)
  - Tumma teema (vaihtoehto)
- **Animaatiot**:
  - Fade-in/fade-out efektit
  - Pehmeät siirtymät
  - Bounce-animaatio tekstille

## Popup-ikkuna

### Komponentit
- Otsikko: "YouTube Overlay Extension"
- Tekstikenttä overlay-tekstin muokkaamiseen
- Tallenna-painike
- Tilaviesti (onnistunut/epäonnistunut tallennus)
- Ohjeteksti näppäinyhdistelmästä

### Tyylittely
- Tailwind CSS -luokat
- Valkoinen tausta
- Pyöristetyt kulmat
- Varjostus
- Responsiivinen muotoilu

## Overlay YouTube-videolla

### Ominaisuudet
- Keskitetty sijainti videon päällä
- Puoliläpinäkyvä musta tausta (rgba(0, 0, 0, 0.8))
- Valkoinen teksti
- Padding tekstin ympärillä
- Näkyvyys toggle näppäinyhdistelmällä

### Käyttökokemus
- Popup aukeaa laajennuksen ikonista
- Teksti tallennetaan automaattisesti
- Overlay näytetään/piilotetaan CTRL + SHIFT + F3 -näppäinyhdistelmällä
- Tilaviestit antavat palautetta toiminnoista

## Komponentit
1. **OverlayComponent**
   ```vue
   <template>
     <Transition name="fade">
       <div
         v-show="visible"
         class="fixed inset-0 flex items-center justify-center bg-black/50 pointer-events-none"
         style="z-index: 999999;"
       >
         <div 
           class="text-white text-4xl font-bold pointer-events-none text-center"
           :class="{ 'animate-bounce': showBounce }"
         >
           {{ text }}
         </div>
       </div>
     </Transition>
   </template>
   ```

2. **PopupComponent**
   - Laajennuksen asetukset
   - Tila-indikaattori
   - Tekstin muokkaus
   - Tallennustoiminto

## Näppäinyhdistelmät
- CTRL + SHIFT + F3: Näytä/piilota overlay
- ESC: Piilota overlay (vaihtoehto) 