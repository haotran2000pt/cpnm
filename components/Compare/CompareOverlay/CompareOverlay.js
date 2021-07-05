import classNames from "classnames"
import Link from "next/link"
import { useState } from "react"
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai"
import { useQueryClient } from "react-query"
import { useDispatch, useSelector } from "react-redux"
import useCompare from "../../../lib/query/useCompare"
import { clearCompare, removeCompare } from "../../../lib/redux/slices/compareSlice"
import numberWithCommas from "../../../utils/numberWithCommas"
import { calcSingleItemPrice } from "../../../utils/priceCalc"
import { LoadingPage } from "../../common/LoadingPage"

const CompareOverlay = ({ onClose }) => {
    const { isLoading, data } = useCompare()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    const onCompare = (e) => {
        if (data && data.length === 1)
            e.preventDefault()
    }

    return (
        <div className="text-white fixed z-20 h-[140px] space-x-4 bg-black bg-opacity-80 left-0 bottom-0 w-full flex-center flex-row">
            {isLoading ? <LoadingPage />
                : _.range(4).map(index => {
                    const product = data[index]
                    return (
                        <div
                            key={`compare${index}}`}
                            className={classNames("relative h-[110px] w-[110px] rounded-xl overflow-hidden border border-gray-500", {
                                "bg-white flex flex-col items-center p-2 text-center text-black text-[11.5px]": product,
                                "flex-center border-gray-400 text-gray-400": !product
                            })}>
                            {product ?
                                <>
                                    <img src={product.images[0]} className="w-8 h-8 flex-shrink-0 object-contain" />
                                    <div className="font-semibold">
                                        <Link href={`/san-pham/${product.slug}`}>
                                            <a>
                                                {product.name}
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="font-medium">{numberWithCommas(calcSingleItemPrice(product))}đ</div>
                                    <button
                                        onClick={() => dispatch(removeCompare({ product, queryClient }))}
                                        className="absolute top-2 right-2">
                                        <AiOutlineClose size={14} />
                                    </button>
                                </>
                                : (
                                    <AiOutlinePlus size={30} />
                                )}
                        </div>
                    )
                })
            }
            <button className="text-sm" onClick={onClose}>ĐÓNG</button>
            <Link href="/compare">
                <button onClick={onCompare} className="font-medium border border-white py-1 px-2">SO SÁNH</button>
            </Link>
            <button
                onClick={() => dispatch(clearCompare(queryClient))}
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