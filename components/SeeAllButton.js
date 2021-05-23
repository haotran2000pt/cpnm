import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

export default function SeeAllButton({ href }) {
    return <div>
        <Link href={href || "/"}>
            <a className="block py-2 px-3 bg-gray-100 text-sm hover:bg-black hover:text-white transition-colors font-bold">
                <span className="align-middle mr-2">Xem thêm</span><IoIosArrowForward className="inline-block" size={22} />
            </a>
        </Link>
    </div>
}