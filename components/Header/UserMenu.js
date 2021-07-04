import Link from "next/link"
import { UserRole } from "../../constants/user"
import { useAuth } from "../../lib/auth"
import firebase from '../../lib/firebase'

export default function UserMenu() {
    const { authUser } = useAuth()

    if (!authUser) return null

    const signOut = () => {
        firebase.auth().signOut()
    }

    return (
        <div className="bg-white border-t shadow-xl w-52 select-none text-base">
            {authUser.role !== UserRole.USER &&
                <Link href='/admin/products'>
                    <a className="block p-2 hover:bg-dark hover:text-white transition-colors w-full text-left border-b">
                        Trang quản lý
                    </a>
                </Link>
            }
            <Link href='/user'>
                <a className="block p-2 hover:bg-dark hover:text-white transition-colors w-full text-left border-b">
                    Trang cá nhân
                </a>
            </Link>
            <Link href='/user/history'>
                <a className="block p-2 hover:bg-dark hover:text-white transition-colors w-full text-left border-b">
                    Lịch sử mua hàng
                </a>
            </Link>
            <button className="p-2 hover:bg-dark hover:text-white transition-colors w-full text-left"
                onClick={signOut}>
                Đăng xuất
            </button>
        </div>
    )
}