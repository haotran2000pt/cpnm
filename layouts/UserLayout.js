import classNames from "classnames"
import _ from "lodash"
import Link from "next/link"
import { useRouter } from "next/router"
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai"
import { IoDocumentOutline } from "react-icons/io5"
import LoadingIcon from "../components/common/LoadingIcon"
import { useAuth } from "../lib/auth"
import Layout from "./Layout"

const userRoutes = [{
    name: "Thông tin tài khoản",
    icon: AiOutlineUser,
    href: "/user"
}, {
    name: "Đổi mật khẩu",
    icon: AiOutlineLock,
    href: "/user/password"
}, {
    name: "Lịch sử mua hàng",
    icon: IoDocumentOutline,
    href: "/user/history"
}]

const UserLayout = ({ children }) => {
    const router = useRouter()
    const { auth, initializing } = useAuth()

    if (router.isReady && !auth && !initializing) {
        router.push('/')
        return <div className="w-screen h-screen flex-center">
            <LoadingIcon />
        </div>
    }

    return (
        <Layout>
            <div className="flex space-x-6 my-4">
                <div className="w-56 flex-shrink-0">
                    <ul className="font-semibold space-y-4 text-sm">
                        {userRoutes.map(route => {
                            const Icon = route.icon
                            return (
                                <li key={route.name}>
                                    <Link href={route.href}>
                                        <a className={classNames('block w-full p-2 transition-colors duration-100', {
                                            'bg-black text-white': router.pathname === route.href,
                                            'hover:bg-gray-200': router.pathname !== route.href
                                        })}><Icon className="inline-block mr-2" size={20} /><span className="align-middle">{route.name}</span></a>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </Layout>
    )
}

export default UserLayout