import Link from "next/link"
import { useAuth } from "../../lib/auth"

export default function UserMenu() {
    const { auth, signOut } = useAuth()

    if (!auth) return null

    return (
        <div className="bg-white border-t shadow w-52 select-none text-base">
            <Link href='/user'>
                <button className="p-2 hover:bg-dark hover:text-white transition-colors w-full text-left border-b">
                    Trang cá nhân
                </button>
            </Link>
            <Link href='/user/history'>
                <button className="p-2 hover:bg-dark hover:text-white transition-colors w-full text-left border-b">
                    Lịch sử mua hàng
                </button>
            </Link>
            <button className="p-2 hover:bg-dark hover:text-white transition-colors w-full text-left"
                onClick={signOut}>
                Đăng xuất
            </button>
        </div>
    )
}