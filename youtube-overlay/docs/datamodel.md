# YouTube Overlay - Tietomalli

## Yleiskatsaus

YouTube Overlay -laajennuksen tietomalli on melko yksinkertainen, koska sovellus tallentaa vain tekstin Chrome Storage API:n avulla. Tässä dokumentissa kuvaamme sovelluksen tietorakenteen ja sen käsittelyn.

## Tietovarastot

### Chrome Storage API

Chrome Storage API tarjoaa useita eri säilytystapoja tiedolle:

- `chrome.storage.sync`: Tallennetaan pilveen ja synkronoidaan käyttäjän eri laitteille
- `chrome.storage.local`: Tallennetaan vain paikallisesti
- `chrome.storage.session`: Tallennetaan istunnon ajaksi

YouTube Overlay käyttää `chrome.storage.sync`-varastoa, jotta käyttäjän määrittelemä teksti on käytettävissä kaikilla laitteilla.

## Tietomallit

### OverlayText

Päätietomalli on yksinkertainen merkkijono, joka tallennetaan avaimella `overlayText`.

```typescript
interface OverlayStorage {
  overlayText: string;
}
```

Oletusarvo: `"Hello world!"`

### UI-tila (ei-persistentti)

Sovellus ylläpitää myös ei-persistenttiä tietoa käyttöliittymän tilasta:

```typescript
interface UIState {
  overlayVisible: boolean;
  overlayInitialized: boolean;
}
```

Oletusarvot:
- `overlayVisible`: `false`
- `overlayInitialized`: `false`

## Tiedon käsittely

### Tiedon tallennus

```javascript
// Tekstin tallennus
chrome.storage.sync.set({overlayText: text}, function() {
  console.log('Teksti tallennettu:', text);
});
```

### Tiedon hakeminen

```javascript
// Tekstin haku
chrome.storage.sync.get('overlayText', function(data) {
  if (data.overlayText) {
    console.log('Tallennettu teksti:', data.overlayText);
  } else {
    console.log('Tekstiä ei löytynyt, käytetään oletusarvoa');
  }
});
```

### Tietomuutosten kuuntelu

```javascript
// Kuuntele muutoksia
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.overlayText) {
    console.log('Teksti muuttunut:', changes.overlayText.oldValue, '->', changes.overlayText.newValue);
  }
});
```

## Alustus ja oletusarvo

Background script alustaa tiedot asennuksen yhteydessä:

```javascript
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('overlayText', function(data) {
    if (!data.overlayText) {
      chrome.storage.sync.set({overlayText: 'Hello world!'}, function() {
        console.log('Oletusteksti asetettu');
      });
    }
  });
});
```

## Tietovirheet

Sovellus käsittelee myös tilanteita, joissa tallennettu tieto puuttuu:

1. Jos `overlayText` puuttuu, käytetään oletusarvoa "Hello world!"
2. Jos tallennus ei onnistu, näytetään virheilmoitus ja käyttöliittymä palautetaan alkutilaan

## Tulevat kehityssuunnat

Tulevissa versioissa tietomallia voidaan laajentaa tukemaan:

1. **Useita tekstejä**:
```typescript
interface EnhancedOverlayStorage {
  overlays: {
    id: string;
    text: string;
    name: string;
  }[];
  activeOverlayId: string;
}
```

2. **Videospesifisiä tekstejä**:
```typescript
interface VideoSpecificOverlayStorage {
  videoOverlays: {
    videoId: string;
    text: string;
  }[];
}
```

3. **Tyylimuunnoksia**:
```typescript
interface StyledOverlayStorage {
  overlayText: string;
  overlayStyle: {
    fontSize: string;
    color: string;
    backgroundColor: string;
    position: 'center' | 'top' | 'bottom';
  };
}
``` 