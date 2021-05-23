import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
    return <footer>
        <div className="bg-dark py-16 px-10 text-white">
            <div className="flex max-w-5xl mx-auto justify-between items-center">
                <div className="max-w-md">
                    <h3 className="font-medium text-xl">
                        Đăng ký để nhận thông tin khuyến mãi và sản phẩm mới nhất
                    </h3>
                    <p className="font-light">Đừng lo lắng, chúng tôi sẽ không spam</p>
                </div>
                <div>
                    <div className="mb-2">Email của bạn:</div>
                    <div className="bg-white p-px">
                        <input className="bg-transparent text-black p-2 h-full w-72 inline-block" />
                        <button className="p-3 bg-dark">Đăng ký</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex py-10 px-36">
            <div className="flex-1">
                <ul className="">
                    <li><Link href="/">Giới thiệu về công ty</Link></li>
                    <li><Link href="/">Câu hỏi thường gặp mua hàng</Link></li>
                    <li><Link href="/">Chính sách bảo mật</Link></li>
                    <li><Link href="/">Quy chế hoạt động</Link></li>
                    <li><Link href="/">Tra cứu thông tin bảo hành</Link></li>
                </ul>
            </div>
            <div className="flex-1">
                <ul>
                    <li><Link href="/">Hệ thống cửa hàng</Link></li>
                    <li><Link href="/">Tin tuyển dụng</Link></li>
                    <li><Link href="/">Tin khuyến mãi</Link></li>
                    <li><Link href="/">Hướng dẫn mua online</Link></li>
                    <li><Link href="/">Hướng dẫn mua trả góp</Link></li>
                    <li><Link href="/">Chính sách trả góp</Link></li>
                </ul>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-lg">Tư vấn mua hàng</h4>
                <h5 className="text-xl text-red-500 font-semibold">1800 1234</h5>
                <h4 className="font-bold text-lg">Hỗ trợ kỹ thuật</h4>
                <h5 className="text-xl text-red-500 font-semibold">1800 5678</h5>
            </div>
            <div className="flex-1">
                <h4 className="font-bold mb-2">Kết nối với chúng tôi</h4>
                <div className="flex text-3xl space-x-3">
                    <a className="text-blue-800" target="blank" href="https://www.facebook.com/"><FaFacebook /></a>
                    <a className="text-blue-500" target="blank" href="https://www.twitter.com/"><FaTwitter /></a>
                    <a className="text-red-500" target="blank" href="https://www.instagram.com/"><FaYoutube /></a>
                </div>
            </div>
        </div>
    </footer>
}