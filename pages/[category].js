import Head from 'next/head'
import ProductCard from '../components/Product/ProductCard'
import { categories } from '../constants/category'
import Layout from '../layouts/Layout'
import { getProducts } from '../lib/db'

export async function getServerSideProps({ query }) {
    if (!categories[query.category]) {
        return {
            notFound: true
        }
    }

    const category = { ...categories[query.category], icon: null }
    const products = await getProducts({
        where: [{
            field: 'category',
            op: '==',
            value: query.category
        }]
    })

    products.sort((a, b) => a.soldUnits - b.soldUnits)

    return {
        props: {
            category, products
        }
    }
}

export default function Category({ category, products }) {


    return (
        <Layout>
            <Head>
                <title>{category.name}</title>
            </Head>
            <h3 className="my-4 text-3xl font-bold text-center">{category.name}</h3>
            <div className="px-2 mb-2 font-medium">
                {products.length} {category.name.toLowerCase()}
            </div>
            <div className="flex flex-wrap">
                {products.map(product => (
                    <div className="w-1/5">
                        <ProductCard key={product.id} product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    )
}