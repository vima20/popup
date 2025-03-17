# Video Overlay - Koodipohjan kaaviot

Tässä dokumentissa on Mermaid-kaaviot, jotka kuvaavat Video Overlay -sovelluksen arkkitehtuuria, tiedonkulkua ja komponenttihierarkiaa.

## Sovelluksen arkkitehtuuri

```mermaid
graph TD
    subgraph "Chrome-laajennus"
        background["Background Script<br>(background.ts)"]
        content["Content Script<br>(content.ts)"]
        popup["Popup<br>(popup/App.vue)"]
        overlay["VideoOverlay<br>(components/VideoOverlay.vue)"]
    end

    subgraph "WebSocket Server"
        server["Node.js Server<br>(server/index.js)"]
        public["Staattiset tiedostot<br>(server/public/)"]
        director["Director UI<br>(director.html)"]
        test["Test UI<br>(test.html)"]
    end

    browser["Selain / YouTube"]

    %% Chrome-laajennuksen sisäiset yhteydet
    background -- "chrome.tabs.sendMessage" --> content
    popup -- "chrome.runtime.sendMessage" --> background
    content -- "createApp" --> overlay
    
    %% WebSocket yhteydet
    background -- "WebSocket" --> server
    overlay -- "WebSocket" --> server
    director -- "WebSocket" --> server
    test -- "WebSocket" --> server
    
    %% Selain-integraatio
    content -- "injektoi" --> browser
    
    %% Staattiset tiedostot
    server -- "tarjoaa" --> public
    public -- "sisältää" --> director
    public -- "sisältää" --> test
```

## Tiedonkulku

```mermaid
sequenceDiagram
    participant Director as Director UI
    participant Server as WebSocket Server
    participant Background as Background Script
    participant Content as Content Script
    participant Overlay as VideoOverlay Component
    participant Viewer as Test UI/Viewer

    %% Yhteyden muodostus
    Director->>Server: Yhdistä (WebSocket)
    Director->>Server: register { role: "director" }
    Viewer->>Server: Yhdistä (WebSocket)
    Viewer->>Server: register { role: "viewer", url: "..." }
    
    %% Katsojamäärän päivitys
    Server->>Director: viewerCount { content: {...} }

    %% Viestin lähetys
    Director->>Server: message { content: "Tervehdys!", style: {...} }
    Server->>Viewer: showMessage { content: "Tervehdys!", style: {...} }
    
    %% Chrome-laajennus toiminta
    Background->>Server: Yhdistä (WebSocket)
    Background->>Server: register { role: "director" }
    Content->>Background: toggleOverlay
    Background->>Content: showMessage/hideMessage
    Content->>Overlay: showMessage/hideMessage
```

## Komponenttihierarkia

```mermaid
classDiagram
    class WebSocketServer {
        +clients: Set
        +viewers: Map
        +clientProperties: Map
        +connection(ws)
        +broadcastViewerCount()
    }
    
    class VideoOverlay {
        -visible: boolean
        -message: string
        -position: string
        -style: object
        +showMessage(data)
        +hideMessage()
        +handleHotkey(event)
    }
    
    class useWebSocket {
        -ws: WebSocket
        -reconnectAttempts: number
        -messageHandlers: array
        -errorHandlers: array
        -openHandlers: array
        -closeHandlers: array
        +connect()
        +disconnect()
        +sendMessage(message)
        +onMessage(handler)
        +onError(handler)
        +onOpen(handler)
        +onClose(handler)
    }
    
    class Message {
        <<interface>>
        +type: string
    }
    
    class ShowMessage {
        <<interface>>
        +type: "showMessage"
        +content: string
        +style?: MessageStyle
    }
    
    class HideMessage {
        <<interface>>
        +type: "hideMessage"
    }
    
    class RegisterMessage {
        <<interface>>
        +type: "register"
        +role: "director" | "viewer"
    }
    
    class ViewerCountMessage {
        <<interface>>
        +type: "viewerCount" 
        +content: object
    }
    
    class MessageStyle {
        <<interface>>
        +position?: string
        +color?: string
        +fontSize?: string
        +duration?: number
    }
    
    ShowMessage --|> Message
    HideMessage --|> Message
    RegisterMessage --|> Message
    ViewerCountMessage --|> Message
    
    VideoOverlay --> useWebSocket : käyttää
    useWebSocket --> Message : käsittelee
    WebSocketServer --> Message : käsittelee
```

## Tiedostohierarkia

```mermaid
graph LR
    subgraph "src/"
        background.ts
        content.ts
        config.ts
        
        subgraph "components/"
            VideoOverlay["VideoOverlay.vue"]
        end
        
        subgraph "types/"
            message["message.ts"]
        end
        
        subgraph "config/"
            websocket["websocket.ts"]
        end
        
        subgraph "composables/"
            useWebSocket["useWebSocket.ts"]
        end
        
        subgraph "popup/"
            popupApp["App.vue"]
            popupIndex["index.ts"]
            popupHtml["index.html"]
        end
        
        subgraph "content/"
            contentIndex["index.ts"]
            contentCss["content.css"]
        end
        
        subgraph "background/"
            backgroundIndex["index.ts"]
        end
    end
    
    subgraph "server/"
        indexJs["index.js"]
        
        subgraph "public/"
            directorHtml["director.html"]
            testHtml["test.html"]
            indexHtml["index.html"]
            testVideo["test-video.mp4"]
        end
    end
```

## WebSocket viestintä

```mermaid
flowchart TD
    subgraph "Viestityypit"
        register["register<br>{role: 'director'|'viewer'}"]
        message["message<br>{content, style}"]
        showMessage["showMessage<br>{content, style}"]
        hideMessage["hideMessage"]
        viewerCount["viewerCount<br>{content: {url: count, ...}}"]
        toggleOverlay["toggleOverlay"]
    end
    
    subgraph "Lähettäjät"
        direction TB
        director1["Director UI"]
        extension["Chrome-laajennus"]
        viewer1["Viewer UI / Test"]
    end
    
    subgraph "Palvelin"
        handleRegister["Käsittele rekisteröinti"]
        handleMessage["Muunna message → showMessage"]
        broadcastViewers["Lähetä katsojamäärät"]
    end
    
    subgraph "Vastaanottajat"
        direction TB
        director2["Director UI"]
        overlay["VideoOverlay"]
        viewer2["Viewer UI / Test"]
    end
    
    %% Viestien lähetys
    director1 --> register & message
    extension --> register & toggleOverlay
    viewer1 --> register
    
    %% Viestien käsittely palvelimella
    register --> handleRegister --> broadcastViewers --> viewerCount
    message --> handleMessage --> showMessage
    
    %% Viestien vastaanotto
    viewerCount --> director2
    showMessage --> overlay & viewer2
    hideMessage --> overlay & viewer2
```

## Viestiprotokolla

```mermaid
classDiagram
    class Message {
        <<interface>>
        +type: string
    }
    
    class BaseMessage {
        <<interface>>
        +type: string
        +[key: string]: any
    }
    
    class ShowMessage {
        <<interface>>
        +type: "showMessage"
        +content: string
        +style?: MessageStyle
    }
    
    class HideMessage {
        <<interface>>
        +type: "hideMessage"
    }
    
    class RegisterMessage {
        <<interface>>
        +type: "register"
        +role: "director" | "viewer"
        +url?: string
    }
    
    class ViewerCountMessage {
        <<interface>>
        +type: "viewerCount"
        +content: object
    }
    
    class ConnectionStatusMessage {
        <<interface>>
        +type: "connectionStatus"
        +status: string
        +error?: string
    }
    
    class ToggleOverlayMessage {
        <<interface>>
        +type: "toggleOverlay"
    }
    
    class MessageStyle {
        <<interface>>
        +position?: "top" | "middle" | "bottom"
        +color?: string
        +fontSize?: string
        +duration?: number
        +[key: string]: any
    }
    
    BaseMessage <|-- ShowMessage
    BaseMessage <|-- HideMessage
    BaseMessage <|-- RegisterMessage
    BaseMessage <|-- ViewerCountMessage
    BaseMessage <|-- ConnectionStatusMessage
    BaseMessage <|-- ToggleOverlayMessage
    Message <|-- BaseMessage
```

## Chrome-laajennuksen arkkitehtuuri

```mermaid
graph TD
    subgraph "Chrome Extension"
        background["Background Script<br>(persistent)"]
        popup["Popup UI<br>(temporary)"]
        content["Content Script<br>(per tab)"]
        overlay["VideoOverlay<br>(Vue component)"]
    end
    
    subgraph "Chrome API"
        tabs["chrome.tabs"]
        runtime["chrome.runtime"]
        commands["chrome.commands"]
    end
    
    subgraph "External"
        ws["WebSocket Server"]
        browser["Browser DOM"]
    end
    
    background -- "connects to" --> ws
    background -- "uses" --> tabs & runtime & commands
    popup -- "uses" --> runtime
    content -- "injects" --> overlay
    content -- "modifies" --> browser
    overlay -- "connects to" --> ws
    
    tabs -- "sendMessage" --> content
    runtime -- "sendMessage" --> background
    commands -- "hotkey" --> background
```

## Avainominaisuudet

1. **Viestien näyttäminen**: Ohjaaja voi lähettää viestejä, jotka näkyvät katsojien videoiden päällä
2. **Näppäinyhdistelmä**: CTRL+SHIFT+9 aktivoi/deaktivoi viestien näkymisen
3. **Katsojamäärän seuranta**: Ohjaaja näkee aktiivisten katsojien määrän
4. **WebSocket-yhteys**: Reaaliaikainen viestintä ohjaajan ja katsojien välillä
5. **Muokattavat viestit**: Viestien tyyliä (sijainti, väri, koko) voi muokata
6. **Useampi käyttöliittymä**: Chrome-laajennus (katsojille) ja web-käyttöliittymä (ohjaajalle) 