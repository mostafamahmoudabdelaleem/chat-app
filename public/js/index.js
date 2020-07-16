if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./serviceworker.js')
            .then((reg) => console.log('Success: ', reg.scope))
            .catch((err) => console.log('Failure: ', err));
    });
};

const installDiv = document.getElementById("install");
const installButton = document.getElementById("installButton");
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  toggleInstallPromotion();
});


installButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Hide the app provided install promotion
    toggleInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
});


window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    console.log('INSTALL: Success');
});


function toggleInstallPromotion(){
    installDiv.hidden = !installDiv.hidden;
}
