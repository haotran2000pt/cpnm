import Layout from '../layouts/Layout'
import Head from 'next/head'
import { getProducts } from '../lib/db'
import { useRouter } from 'next/router'
import _ from 'lodash'
import removeAccents from '../utils/removeAccents'
import ProductCard from '../components/Product/ProductCard'

const searchTwoString = (text, search) => removeAccents(text.toLowerCase()).includes(removeAccents(search.toLowerCase()))

export async function getServerSideProps({ query }) {
    let products = await getProducts({})

    products = products.filter(product => searchTwoString(product.name, query.key))

    return {
        props: {
            products
        }
    }
}

export default function Search({ products }) {
    const router = useRouter()

    return (
        <Layout>
            <Head>
                <title>{`Kết quả tìm kiếm cho ${router?.query?.key}`}</title>
            </Head>
            <h3 className="my-4 text-lg">
                {_.isEmpty(products)
                    ? <>Không tìm thấy kết quả nào phù hợp với từ khóa <span className="font-bold">"{router?.query?.key}"</span></>
                    : <>Tìm thấy <span className="font-bold">{products.length}</span> kết quả cho từ khóa <span className="font-bold">"{router?.query?.key}"</span></>}
            </h3>
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