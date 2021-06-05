import Link from "next/link";
import { IoSad } from "react-icons/io5";
import Layout from "../layouts/Layout";

export default function Custom404() {
    return <Layout>
        <div className="p-28 text-center text-dark">
            <h1 className="text-7xl font-bold select-none mb-2">
                <span className="align-middle">4</span><IoSad className="inline-block" /><span className="align-middle">4</span>
            </h1>
            <div className="mb-4 font-semibold">Rất tiếc, trang bạn tìm kiếm không tồn tại</div>
            <Link href="/">
                <a className="max-w-md block btn dark mx-auto">
                    VỀ TRANG CHỦ
                </a>
            </Link>
        </div >
    </Layout >
}
