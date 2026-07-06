const API_URL = import.meta.env.VITE_API_URL || "https://pageadminapro.onrender.com";
const PUBLIC_VAPID_KEY = "BD7OCYa1teLqmg9dFJTEJM2PURSJAE0spjZEYefZPNj_8w-nXDnHl3aO5UvTx9j0p_0-5A9rekXu3xXjI-zaSMU";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export const activerNotifications = async () => {
  try {
    if (!("serviceWorker" in navigator)) throw new Error("Service Worker non supporté");
    
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
    }

    const response = await fetch(`${API_URL}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) throw new Error("Erreur serveur lors de l'abonnement");
    return true;
  } catch (err) {
    console.error("Erreur notification :", err);
    return false;
  }
};