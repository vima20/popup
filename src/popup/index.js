// Popup-ikkunan toiminnallisuus
document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message');
  const showButton = document.getElementById('showOverlay');

  // Näytä viesti kun nappia painetaan
  showButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      // Lähetä viesti aktiiviselle välilehdelle
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'showMessage',
            content: message,
            style: {
              position: 'top',
              color: 'white',
              fontSize: '24px',
              duration: 5000
            }
          });
        }
      });
    }
  });

  // Näytä viesti kun Enter-näppäintä painetaan
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      showButton.click();
    }
  });
}); 