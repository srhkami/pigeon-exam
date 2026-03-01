import {AuthProvider} from "@/auth/AuthContext.tsx";
import {RouterProvider} from "react-router";
import routes from "@/routes/routes.tsx";
import {useEffect} from "react";
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'keen-slider/keen-slider.min.css'
import ReloadPrompt from "@/layout/ReloadPrompt.tsx";
import {QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {get, set, del} from 'idb-keyval';

export default function App() {

  useEffect(() => {
    AOS.init({
      once: false, // 每次進入畫面都觸發動畫
      mirror: true, // 向上滾動時也觸發（需配合動畫類型）
    });
  }, [])

  // 建立 QueryClient，並設定緩存時間
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 72, // 緩存保留 72 小時
        staleTime: 1000 * 60 * 5,    // 5 分鐘內視為新鮮，不重複抓取
      },
    },
  });

  // 建立一個基於 IndexedDB 的 Persister
  const indexedDBPersister = createAsyncStoragePersister({
    storage: {
      getItem: (key) => get(key),
      setItem: (key, value) => set(key, value),
      removeItem: (key) => del(key),
    },
  });

  return (
    <AuthProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: indexedDBPersister,
          buster: 'v1', // 當你 API 格式大改時，更換此字串可清除使用者舊的緩存
        }}
      >
        <RouterProvider router={routes}/>
        <ReloadPrompt/>
      </PersistQueryClientProvider>
    </AuthProvider>
  )
}