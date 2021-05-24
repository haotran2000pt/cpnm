import Layout from '../layouts/Layout'

export default function Category() {
    return (
        <Layout>
            asdasd
        </Layout>
    )
}

export async function getServerSideProps({ params, query }) {
    console.log(query)
    return {
        props: {},
    }
}
