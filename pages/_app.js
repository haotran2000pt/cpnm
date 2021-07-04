import 'animate.css/animate.min.css';
import { useEffect, useState } from 'react';
import 'react-notifications-component/dist/theme.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import Router from 'next/router'
import nProgress from 'nprogress'
import 'react-responsive-modal/styles.css';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/swiper.scss';
import "nprogress/nprogress.css";
import { AuthProvider } from '../lib/auth';
import { getGlobalData } from '../lib/db';
import '../styles/tailwind.scss';
import '../styles/globals.css';
import ReactNotification from 'react-notifications-component'
import { Provider } from 'react-redux'
import { persistor, store } from '../lib/redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { CartProvider } from '../contexts/cart';

nProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())
  const [initial, setInitial] = useState(false)

  useEffect(() => {
    (async () => {
      await queryClient.prefetchQuery('global', getGlobalData)
      setInitial(true)
    })()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          {initial ?
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <CartProvider>
                  <ReactNotification />
                  <Component {...pageProps} />
                </CartProvider>
              </PersistGate>
            </Provider>
            :
            <div />
          }
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
