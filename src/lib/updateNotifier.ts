// Admin panelinden yapılan değişiklikleri ana sayfaya bildirmek için

const CHANNEL_NAME = 'corexe-site-update';

export function notifySiteUpdate() {
  if (typeof window === 'undefined') return;
  
  // BroadcastChannel ile farklı tab'lar arası iletişim
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'SITE_UPDATED', timestamp: Date.now() });
    channel.close();
  } catch (e) {
    console.warn('BroadcastChannel not supported, using localStorage fallback');
  }
  
  // localStorage fallback (daha geniş tarayıcı desteği)
  try {
    localStorage.setItem('corexe-site-update', Date.now().toString());
    localStorage.removeItem('corexe-site-update'); // Event tetiklemek için
  } catch (e) {
    console.warn('localStorage not available');
  }
}

export function listenForSiteUpdates(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  
  // BroadcastChannel listener
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data.type === 'SITE_UPDATED') {
        console.log('🔄 Site güncellemesi algılandı (BroadcastChannel)');
        callback();
      }
    };
  } catch (e) {
    console.warn('BroadcastChannel not supported');
  }
  
  // localStorage event listener (fallback)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'corexe-site-update' && e.newValue) {
      console.log('🔄 Site güncellemesi algılandı (localStorage)');
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Cleanup function
  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', handleStorageChange);
  };
}
