import classNames from "classnames"
import Sidebar from "../components/Admin/Sidebar"
import { useAuth } from "../lib/auth"
import { UserRole } from '../constants/user'
import ErrorPage from "../pages/404"
import { useRouter } from "next/router"
import { LoadingPage } from "../components/common/LoadingPage"

export default function AdminLayout({ children }) {
    const { authUser } = useAuth()
    const router = useRouter()

    if (!authUser || authUser.role === UserRole.USER) {
        return <ErrorPage />
    }

    if (router.pathname === '/admin') {
        router.push('/admin/products')
        return <LoadingPage />
    }

    return (
        <div className="flex text-gray-700 min-w-[1100px] relative">
            <div className={classNames('w-64 flex-shrink-0 self-start sticky top-0 transform duration-300 transition-all h-full')}>
                <Sidebar />
            </div>
            <main className={classNames('flex-grow rounded-2xl bg-admin border-admin-200 border p-4 transition-all duration-300 m-4')}>
                {children}
            </main>
        </div>
    )
}