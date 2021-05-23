import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Thumbs, Navigation } from 'swiper/core';
import classNames from 'classnames';

SwiperCore.use([Thumbs, Navigation]);

export default function ProductImageGallery({ images }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="h-full">
            <Swiper
                className="mb-4"
                autoHeight={true}
                thumbs={{ swiper: thumbsSwiper }}
                lazy={true}
            >
                {images.map(image => (
                    <SwiperSlide>
                        <img className="mx-auto" src={image.src} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="max-w-md mx-auto">
                <Swiper
                    freeMode={true}
                    onSwiper={setThumbsSwiper}
                    watchSlidesVisibility
                    watchSlidesProgress
                    slidesPerView={4}
                    spaceBetween={15}
                    navigation={true}
                >
                    {images.map(image => (
                        <SwiperSlide>
                            <div className='h-24 border p-2 hover:border-blue-500 cursor-pointer'>
                                <img className='mx-auto h-full w-auto object-contain' src={image.src} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}