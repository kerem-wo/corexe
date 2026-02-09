"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { listenForSiteUpdates } from "@/lib/updateNotifier";
import type { SiteData } from "@/lib/types";

interface SiteDataContextType {
  data: SiteData | null;
  loading: boolean;
  refresh: () => void;
}

const SiteDataContext = createContext<SiteDataContextType>({
  data: null,
  loading: true,
  refresh: () => {},
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetch("/api/site", { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((newData) => {
        console.log('🔄 Site data refreshed:', newData.site?.name);
        setData(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load site data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();

    // Admin panelinden gelen güncelleme bildirimlerini dinle (ANLIK GÜNCELLEME)
    const cleanup = listenForSiteUpdates(() => {
      console.log('⚡ Site güncellemesi algılandı, veri yenileniyor...');
      loadData();
    });

    // Her 30 saniyede bir otomatik yenile (fallback - çok sık istek yapmamak için)
    const interval = setInterval(loadData, 30000);

    // Sayfa görünür olduğunda yenile
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    window.addEventListener('focus', loadData);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanup();
      clearInterval(interval);
      window.removeEventListener('focus', loadData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ data, loading, refresh: loadData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
