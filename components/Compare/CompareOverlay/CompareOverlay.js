import Link from "next/link"
import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import useCompare from "../../../lib/query/useCompare"
import { clearCompare, removeCompare } from "../../../lib/redux/slices/compareSlice"
import numberWithCommas from "../../../utils/numberWithCommas"
import { calcSingleItemPrice } from "../../../utils/priceCalc"
import { LoadingPage } from "../../common/LoadingPage"

const CompareOverlay = ({ onClose }) => {
    const { isLoading, data } = useCompare()
    const dispatch = useDispatch()

    const onCompare = (e) => {
        if (data && data.length === 1)
            e.preventDefault()
    }

    return (
        <div className="text-white fixed z-20 h-[160px] space-x-4 bg-black bg-opacity-80 left-0 bottom-0 w-full flex-center flex-row">
            {isLoading ? <LoadingPage />
                : data.map(product => (
                    <div key={`compare${product.sku}`} className="relative text-black text-[11.5px] h-[120px] w-[120px] rounded-xl
                    overflow-hidden border border-gray-500 bg-white flex flex-col items-center p-2 text-center">
                        <img src={product.images[0]} className="w-10 h-10" />
                        <div className="font-semibold">
                            <Link href={`/san-pham/${product.slug}`}>
                                <a>
                                    {product.name}
                                </a>
                            </Link>
                        </div>
                        <div className="font-medium">{numberWithCommas(calcSingleItemPrice(product))}đ</div>
                        <button
                            onClick={() => dispatch(removeCompare(product))}
                            className="absolute top-2 right-2">
                            <AiOutlineClose size={14} />
                        </button>
                    </div>
                ))
            }
            <button className="text-sm" onClick={onClose}>ĐÓNG</button>
            <Link href="/compare">
                <button onClick={onCompare} className="font-medium border border-white py-1 px-2">SO SÁNH</button>
            </Link>
            <button
                onClick={() => dispatch(clearCompare())}
                className="font-medium border border-white py-1 px-2">
                XÓA HẾT
            </button>
        </div>
    )
}

export const CompareButton = () => {
    const products = useSelector(state => state.compare.products)
    const [openOverlay, setOpenOverlay] = useState(false)

    return (
        products.length !== 0 ?
            <>
                <button onClick={() => setOpenOverlay(true)} className="z-10 bg-black text-white py-1 px-2 font-semibold rounded-full">
                    So sánh ({products.length})
                </button>
                {openOverlay && <CompareOverlay onClose={() => setOpenOverlay(false)} />}
            </>
            : null
    )
}