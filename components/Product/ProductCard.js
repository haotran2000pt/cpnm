import Link from 'next/link'
import { FiHeart } from 'react-icons/fi'
import { BiCartAlt } from 'react-icons/bi'
import { AiFillStar } from 'react-icons/ai'
import LazyLoad from 'react-lazyload'

export default function ProductCard() {
    return <div className="w-1/5 px-2 mb-4 group select-none">
        <div className="bg-gray-100 p-5 relative">
            <Link href="/product/5">
                <a className="h-52 mb-4 flex items-center justify-center group-hover:scale-105 transform transition-transform duration-500">
                    <LazyLoad height={144}>
                        <img className="h-36 w-auto object-contain"
                            src="https://hoanghamobile.com/i/preview/Uploads/2021/01/22/image-removebg-preview.png"
                            alt="product"
                        />
                    </LazyLoad>
                </a>
            </Link>
            <div>
                <h3 className="font-bold py-1 px-2 inline-block group-hover:bg-dark transition-colors group-hover:text-white duration-200">
                    iPhone X 64GB
                </h3>
                <div style={{ fontSize: 15 }} className="py-1 px-2 group-hover:text-white duration-200 group-hover:bg-dark inline-block font-semibold">
                    <span className="inline-block">
                        19,999,999đ
                    </span>
                    <span className="ml-2 text-gray-400 inline-block group-hover:text-white duration-200 line-through">
                        23,999,999đ
                    </span>
                </div>
            </div>
            {/* <div className="text-sm absolute left-0 top-0 py-1 px-2 group-hover:bg-dark group-hover:text-white transition-colors duration-200">
                <span className="align-middle font-bold">4.5</span> <AiFillStar className="inline-block text-yellow-500" />
            </div> */}
        </div>
    </div>
}