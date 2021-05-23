import Head from 'next/head'
import Image from 'next/image'
import Layout from '../layouts/Layout'
import { SiApple, SiHuawei, SiLg, SiOneplus, SiSamsung, SiXiaomi } from 'react-icons/si'
import SeeAllButton from '../components/SeeAllButton'
import ProductCard from '../components/Product/ProductCard'
import HeroBanner from '../components/Banner/HeroBanner'
import { FiHeadphones, FiSmartphone } from 'react-icons/fi'
import { MdPayment, MdSmartphone, MdTablet } from 'react-icons/md'
import { AiOutlineCamera, AiOutlineTablet } from 'react-icons/ai'
import { IoReturnUpBackOutline, IoWatch, IoWatchOutline } from 'react-icons/io5'
import { RiShieldCheckLine, RiTruckLine } from 'react-icons/ri'
import Banner from '../components/Banner/Banner'

export default function Home() {
  return (
    <Layout noPadding aboveComponent={<HeroBanner />}>
      <div className="space-x-10 flex mb-4 justify-center">
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded group">
          <MdSmartphone className="text-gray-700 mb-1 group-hover:scale-125 transform transition-transform duration-300" size={33} />
          <div className="text-gray-800">Điện thoại</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded group">
          <AiOutlineTablet className="text-gray-700 mb-1 group-hover:scale-125 transform transition-transform duration-300" size={33} />
          <div className="text-gray-800">Máy tính bảng</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded group">
          <FiHeadphones className="text-gray-700 mb-1 group-hover:scale-125 transform transition-transform duration-300" size={33} />
          <div className="text-gray-800">Tai nghe</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded group">
          <IoWatchOutline className="text-gray-700 mb-1 group-hover:scale-125 transform transition-transform duration-300" size={33} />
          <div className="text-gray-800">Smartwatch</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded group">
          <AiOutlineCamera className="text-gray-700 mb-1 group-hover:scale-125 transform transition-transform duration-300" size={33} />
          <div className="text-gray-800">Máy ảnh</div>
        </button>
      </div>
      <div className="mb-4">
        <div className="flex mb-3 items-center">
          <div className="flex-1 h-px bg-gray-200" />
          <h3 className="font-bold text-2xl flex-shrink-0 mx-4">Sản phẩm đang khuyến mãi</h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-wrap -mx-2">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
      <Banner
        item={{
          src: 'https://macad.vn/upload/banner-watch-seri4.jpg',
          alt: 'Apple Watch Series 6 banner',
          href: '/'
        }}
        className="my-3"
      />
      <div className="mb-4">
        <div className="flex mb-3">
          <h3 className="font-bold text-xl flex-shrink-0">Sản phẩm nổi bật</h3>
        </div>
        <div className="flex flex-wrap -mx-2">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <div className="flex mb-3">
          <h3 className="font-bold text-xl flex-shrink-0">Sản phẩm mới nhất</h3>
        </div>
        <div className="flex flex-wrap -mx-2">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </Layout>
  )
}
