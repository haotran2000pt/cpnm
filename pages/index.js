import Head from 'next/head'
import Image from 'next/image'
import Layout from '../layouts/Layout'
import ProductCard from '../components/Product/ProductCard'
import HeroBanner from '../components/Banner/HeroBanner'
import { FiHeadphones } from 'react-icons/fi'
import { MdSmartphone } from 'react-icons/md'
import { AiOutlineCamera, AiOutlineTablet } from 'react-icons/ai'
import { IoWatchOutline } from 'react-icons/io5'
import Banner from '../components/Banner/Banner'
import axios from 'axios'

export async function getStaticProps({ }) {
  const categories = await axios.get('/api/categories')
  console.log(categories)
  return {
    props: {
      categories
    },
    revalidate: 10000
  }
}

export default function Home({ categories }) {
  console.log(categories)
  return (
    <Layout noPadding aboveComponent={<HeroBanner />}>
      <div className="space-x-10 flex mb-4 justify-center">
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
          <MdSmartphone className="mb-1" size={33} />
          <div className="font-medium text-sm">Điện thoại</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
          <AiOutlineTablet className="mb-1" size={33} />
          <div className="font-medium text-sm">Máy tính bảng</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
          <FiHeadphones className="mb-1" size={33} />
          <div className="font-medium text-sm">Tai nghe</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
          <IoWatchOutline className="mb-1" size={33} />
          <div className="font-medium text-sm">Smartwatch</div>
        </button>
        <button className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
          <AiOutlineCamera className="mb-1" size={33} />
          <div className="font-medium text-sm">Máy ảnh</div>
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
