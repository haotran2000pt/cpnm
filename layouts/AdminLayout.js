import { useAuth } from "../lib/auth"
import Sidebar from "../components/Admin/Sidebar"
import classNames from "classnames"
import { useState } from "react"
import ErrorPage from '../pages/404'
import { useRouter } from "next/router"

export default function AdminLayout({ children }) {
    const [expand, setExpand] = useState(true)
    const { auth } = useAuth()
    const router = useRouter()

    if (!auth || auth.role !== 'admin') {
        return <ErrorPage />
    }

    if (router.pathname === '/admin' && router.isReady) {
        router.push('/admin/products')
        return null
    }

    return (
        <div className="flex text-gray-700">
            <div className={classNames('w-64 flex-shrink-0 self-start sticky top-0 transform duration-300 transition-all', {
                '-translate-x-64': !expand
            })}>
                <Sidebar />
            </div>
            <main className={classNames('flex-grow rounded-2xl bg-admin border-admin-200 border p-4 transition-all duration-300 m-4', {
                '-ml-60': !expand
            })}>
                {children}
            </main>
        </div>
    )
}