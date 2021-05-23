import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import Link from 'next/link';


SwiperCore.use([Navigation, Autoplay]);

const banners = [{
    imgUrl: "https://live.hasthemes.com/html/5/abelo-preview/abelo/assets/images/slider-image/sample-1.jpg",
    href: "/a",
    alt: "sad",
    color: "black"
}, {
    imgUrl: "https://cdn.tgdd.vn/2021/05/banner/big-samsung-830-300-830x300.png",
    href: "/s",
    alt: "sad",
    color: "black"
}, {
    imgUrl: "https://assorted.downloads.oppo.com/static/archives/images/dd/Smartphones/Reno3%20Pro/homepage-largebanner-pc-black-white.png",
    href: "/d",
    alt: "sad",
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
                <SwiperSlide key={banner.alt}>
                    <Link href={banner.href}>
                        <a style={{ backgroundColor: banner.color }}>
                            <img className="w-full" src={banner.imgUrl} alt={banner.alt} />
                        </a>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    </div >
}