import Layout from "../layouts/Layout"
import { useAuth } from "../lib/auth"

export default function Account() {
    const { auth } = useAuth()

    return (
        <Layout>
            <div>
                {auth ? "AUTH" : "NOT AUTH"}
            </div>
        </Layout>
    )
}