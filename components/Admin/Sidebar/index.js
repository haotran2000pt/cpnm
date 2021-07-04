import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHome, AiOutlineKey, AiOutlineMenu, AiOutlinePoweroff, AiOutlineUser } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { BiDevices } from "react-icons/bi";
import { useAuth } from "../../../lib/auth";
import { MdLockOutline } from "react-icons/md";
import useGlobal from "../../../lib/query/useGlobal";

const routes = [{
    path: '/',
    name: 'Trang chủ',
    icon: AiOutlineHome
}, {
    path: '/admin/products',
    name: 'Quản lý sản phẩm',
    icon: BiDevices
}, {
    path: '/admin/users',
    name: 'Quản lý người dùng',
    icon: AiOutlineUser
}, {
    path: '/admin/orders',
    name: 'Quản lý đơn hàng',
    icon: FiPackage
}, {
    path: '/admin/info',
    name: 'Thông tin doanh nghiệp',
    icon: AiOutlineHome
}, {
    path: '/admin/password',
    name: 'Đổi mật khẩu',
    icon: MdLockOutline
}]

export default function Sidebar() {
    const router = useRouter()
    const { data } = useGlobal()
    const { signOut } = useAuth()

    return (
        <div className="bg-admin-sidebar text-sm font-semibold text-gray-200 flex flex-col justify-between h-screen rounded-tr-3xl p-4">
            <div>
                <div className="mb-4 h-12 w-full flex-center border-b">
                    {data.storeInfo.name}
                </div>
                <div className="space-y-2">
                    {routes.map(route => {
                        const Icon = route.icon
                        const match = route.path === '/' ? false : router.asPath.includes(route.path)
                        return (
                            <Link key={route.name} href={route.path}>
                                <a className={classNames('block w-full px-4 py-3 rounded-xl', {
                                    'bg-admin text-indigo-700': match,
                                    'hover:bg-white hover:bg-opacity-10': !match,
                                })}>
                                    <Icon className="inline-block mr-3 text-2xl" />
                                    <span style={{ fontSize: 13 }}>{route.name}</span>
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="py-4">
                <div className="text-center">
                    <button onClick={async () => {
                        try {
                            await signOut()
                            router.push('/')
                        } catch (e) {
                            alert('Đăng xuất thất bại\n' + e?.message || e)
                        }
                    }}
                        className="border border-white shadow-md w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white">
                        <AiOutlinePoweroff className="inline-block" size={24} />
                    </button>
                </div>
            </div>
        </div>
    )
}