import Layout from '../layouts/Layout'
import ProductCard from '../components/Product/ProductCard'
import HeroBanner from '../components/Banner/HeroBanner'
import Banner from '../components/Banner/Banner'
import Link from 'next/link'
import { categories, categoryIcon } from '../constants/category'
import Button from '../components/common/Button'
import { getProducts } from '../lib/db'

export async function getServerSideProps({ }) {
  const saleProducts = await getProducts({
    where: [{
      field: "discount",
      op: ">",
      value: 0
    }],
    order: [{
      field: "discount",
      direction: "desc"
    }],
    limit: 5
  })

  const newProducts = await getProducts({
    order: [{
      field: "created_at",
      direction: "desc"
    }],
    limit: 5
  })

  const featuredProducts = await getProducts({
    order: [{
      field: "soldUnits",
      direction: "desc"
    }],
    limit: 5
  })


  return {
    props: {
      saleProducts,
      newProducts,
      featuredProducts
    }
  }
}

export default function Home({ saleProducts, newProducts, featuredProducts }) {

  return (
    <Layout noPadding aboveComponent={<HeroBanner />}>
      {/* CATEGORIES */}
      <div className="space-x-10 flex mb-4 justify-center">
        {Object.keys(categories).map(catId => {
          const category = categories[catId]
          const Icon = categoryIcon[catId]
          return (
            <Link key={catId + 'HomeLink'} href={'/' + catId}>
              <a className="w-32 h-24 bg-gray-100 flex flex-col items-center justify-center rounded hover:shadow-lg hover:bg-dark hover:text-white transition-all">
                {Icon && <Icon className="mb-1" size={33} />}
                <div className="font-medium text-sm">{category.name}</div>
              </a>
            </Link>
          )
        })}
      </div>
      {/* KHUYEN MAI */}
      <div className="mb-4">
        <div className="flex mb-3 items-center">
          <div className="flex-1 h-px bg-gray-200" />
          <h3 className="font-bold text-2xl flex-shrink-0 mx-4">Sản phẩm đang khuyến mãi</h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-wrap -mx-2">
          {saleProducts.map(product => (
            <div key={`sale${product.id}`} className="w-1/5">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <Banner
        item={{
          src: '/ipad-pro2020-banner.jpg',
          alt: 'iPad Pro 2020 banner',
          href: '/san-pham/ipad-pro-2020'
        }}
        className="my-3"
      />
      <div className="mb-4">
        <div className="flex mb-3">
          <h3 className="font-bold text-xl flex-shrink-0">Sản phẩm nổi bật</h3>
        </div>
        <div className="flex flex-wrap -mx-2">
          {featuredProducts.map(product => (
            <div key={`featured${product.id}`} className="w-1/5">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className='max-w-sm mx-auto'>
          <Button white>
            Xem thêm
          </Button>
        </div>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <div className="flex mb-3">
          <h3 className="font-bold text-xl flex-shrink-0">Sản phẩm mới nhất</h3>
        </div>
        <div className="flex flex-wrap -mx-2">
          {newProducts.map(product => (
            <div key={`new${product.id}`} className="w-1/5">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className='max-w-sm mx-auto'>
          <Button white>
            Xem thêm
          </Button>
        </div>
      </div>
    </Layout>
  )
}
