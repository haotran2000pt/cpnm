import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'react-responsive-modal/styles.css'
import 'animate.css/animate.min.css'
import 'react-notifications-component/dist/theme.css'
import '../styles/globals.css'
import { AuthProvider } from '../lib/auth';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactNotification from 'react-notifications-component'
import { CartProvider } from '../contexts/cart';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ReactNotification />
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default MyApp
