import Link from "next/link";
import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import Layout from "../../layouts/Layout";
import SwiperCore, { Thumbs } from 'swiper/core';
import { useState } from "react";
import ProductImageGallery from "../../components/Product/ProductImageGallery";
import Button from '../../components/common/Button'
import ProductCard from "../../components/Product/ProductCard";
import UserReview from "../../components/Product/UserReview";

SwiperCore.use([Thumbs]);

const images = [
    {
        src: 'https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max_1__7.jpg',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
        src: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-spacegray-202009?wid=470&hei=556&fmt=png-alpha&.v=1598650646000',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
        src: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-black-select-2020?wid=470&hei=556&fmt=png-alpha&.v=1586574260051',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
        src: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-white-select-2020?wid=470&hei=556&fmt=png-alpha&.v=1586574259457',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
        src: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-red-select-2020?wid=470&hei=556&fmt=png-alpha&.v=1586574260319',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];


export default function Product() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <Layout>
            <div className="flex space-x-8 mt-4 mx-auto max-w-5xl mb-8">
                <div className="w-1/2">
                    <ProductImageGallery images={images} />
                </div>
                <div className="flex-1 p-3">
                    <Link href="/">
                        <a className="underline font-medium mb-1 block">
                            Điện thoại
                        </a>
                    </Link>
                    <h3 className="text-2xl font-semibold mb-1">iPhone 12 Pro Max 256GB</h3>
                    <div className="mb-4">
                        <div className="inline-flex space-x-0.5 align-middle text-yellow-400">
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar className="text-gray-200" />
                        </div>
                        <span className="ml-2 text-sm">(3 đánh giá)</span>
                    </div>
                    <div className="mb-2 text-sm">
                        <div className="font-bold">Chọn màu sắc:</div>
                        <div className="flex flex-wrap space-x-3 pt-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border shadow" />
                            <div className="w-8 h-8 rounded-full bg-white cursor-pointer border shadow" />
                            <div className="w-8 h-8 rounded-full bg-black cursor-pointer border shadow" />
                            <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer border shadow" />
                        </div>
                    </div>
                    <hr className="my-2" />
                    <div className="mb-2 text-sm">
                        <div className="font-bold">Chọn phiên bản:</div>
                        <div className="flex flex-wrap space-x-3 pt-2">
                            <div className="shadow w-32 h-16 border rounded-md hover:border-blue-600 cursor-pointer flex flex-col items-center justify-center">
                                <div className="text-sm font-medium">512GB</div>
                                <div className="text-red-600 font-semibold">38.500.000 đ</div>
                            </div>
                            <div className="shadow w-32 h-16 border rounded-md hover:border-blue-600 cursor-pointer flex flex-col items-center justify-center">
                                <div className="text-sm font-medium">256GB</div>
                                <div className="text-red-600 font-semibold">32.000.000 đ</div>
                            </div>
                            <div className="shadow w-32 h-16 border rounded-md hover:border-blue-600 cursor-pointer flex flex-col items-center justify-center">
                                <div className="text-sm font-medium">128GB</div>
                                <div className="text-red-600 font-semibold">29.300.000 đ</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-2xl font-semibold text-gray-700 mb-4">
                        38.500.000 đ
                    </div>
                    <div className="w-8/12 mr-4 mb-3">
                        <Button white>
                            THÊM VÀO GIỎ HÀNG
                        </Button>
                    </div>
                    <button>
                        <AiOutlineHeart className='inline-block' size={24} />
                        <span className="ml-2 text-sm font-medium align-middle">Thêm vào yêu thích</span>
                    </button>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Thông số kỹ thuật</h4>
                <div className="px-8 py-6 bg-gray-100 max-w-3xl space-y-1">
                    <div>
                        <span className="inline-block w-1/2">Màn hình:</span>
                        <span>OLED6.7"Super Retina XDR</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Hệ điều hành:</span>
                        <span>iOS 14</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Camera sau:</span>
                        <span>3 camera 12 MP</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Camera trước:</span>
                        <span>12 MP</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Chip:</span>
                        <span>Apple A14 Bionic</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">RAM:</span>
                        <span>6GB</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Bộ nhớ trong:</span>
                        <span>256 GB</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">SIM:</span>
                        <span>1 Nano SIM & 1 eSIMHỗ trợ 5G</span>
                    </div>
                    <div>
                        <span className="inline-block w-1/2">Pin, Sạc:</span>
                        <span>3687 mAh, 20 W</span>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Các sản phẩm tương tự</h4>
                <div className="flex -mx-2">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </div>
            <hr className="mb-4" />
            <div className="mb-2 max-w-3xl">
                <h4 className="text-xl font-bold mb-2">Đánh giá</h4>
                <UserReview />
                <hr className="my-2" />
                <UserReview />
                <div className="max-w-md mx-auto">
                    <Button white>
                        Tải thêm
                    </Button>
                </div>
            </div>
        </Layout>
    )
}