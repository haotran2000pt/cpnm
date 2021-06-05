import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import Link from 'next/link';
import Image from 'next/image';

SwiperCore.use([Navigation, Autoplay]);

const banners = [{
    imgUrl: "/iphone_12_banner.jpg",
    width: 1024,
    height: 536,
    slug: "/iphone-12-pro",
    color: "black"
}, {
    imgUrl: "/xiaomi11-banner.jpg",
    width: 1200,
    height: 675,
    slug: "/xiaomi-11i",
    color: "black"
}, {
    imgUrl: "/samsung-galaxy-note-20-banner.jpg",
    width: 122,
    height: 231,
    slug: "/samsung-galaxy-note-20",
    color: "black"
}]

export default function HeroBanner() {
    return <div>
        <Swiper
            slidesPerView={1}
            navigation={true}
            preloadImages={true}
            loop={true}
            autoHeight={true}
        >
            {banners.map(banner => (
                <SwiperSlide key={banner.imgUrl}>
                    <Link href={'/san-pham' + banner.slug}>
                        <a style={{ backgroundColor: banner.color }}>
                            <img src={banner.imgUrl} alt={banner.alt} />
                        </a>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    </div >
}