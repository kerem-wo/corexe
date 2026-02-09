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
  // Aynı tab'da çalışması için custom event kullan
  try {
    const timestamp = Date.now().toString();
    localStorage.setItem('corexe-site-update', timestamp);
    // Custom event gönder (aynı tab için)
    window.dispatchEvent(new CustomEvent('corexe-site-update', { detail: { timestamp } }));
    // Storage event için (farklı tab'lar)
    setTimeout(() => {
      localStorage.removeItem('corexe-site-update');
    }, 100);
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
  
  // localStorage event listener (fallback - farklı tab'lar için)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'corexe-site-update' && e.newValue) {
      console.log('🔄 Site güncellemesi algılandı (localStorage - farklı tab)');
      callback();
    }
  };
  
  // Custom event listener (aynı tab için)
  const handleCustomUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.timestamp) {
      console.log('🔄 Site güncellemesi algılandı (CustomEvent - aynı tab)');
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('corexe-site-update', handleCustomUpdate);
  
  // Cleanup function
  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('corexe-site-update', handleCustomUpdate);
  };
}
