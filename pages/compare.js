import Layout from "../layouts/Layout";
import useCompare from "../lib/query/useCompare";
import { LoadingPage } from "../components/common/LoadingPage";
import _ from "lodash";
import numberWithCommas from "../utils/numberWithCommas";
import { calcSingleItemPrice } from "../utils/priceCalc";
import Link from "next/link";
import { useState } from "react";
import { useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeCompare } from "../lib/redux/slices/compareSlice";
import ErrorPage from '../pages/404'

export default function ComparePage() {
    const products = useSelector(state => state.compare.products)
    const { isLoading, data } = useCompare()
    const [showDifferent, setShowDifferent] = useState(false)
    const dispatch = useDispatch()

    const specifications = useMemo(() => {
        if (!data) {
            return null
        }
        const specifications = {}
        data.forEach((product, index) => {
            product.specifications.forEach(section => {
                if (!specifications[section.name]) {
                    specifications[section.name] = {}
                }
                section.specs.forEach(spec => {
                    if (!specifications[section.name][spec.title]) {
                        specifications[section.name][spec.title] = [null, null, null, null]
                    }
                    specifications[section.name][spec.title][index] = spec.detail
                })
            })
        })
        if (showDifferent) {
            Object.keys(specifications).forEach(section => {
                Object.keys(specifications[section]).forEach(spec => {
                    const isSame = _.uniq(specifications[section][spec].slice(0, 2)).length === 1
                    if (isSame) {
                        delete specifications[section][spec]
                    }
                })
            })

            Object.keys(specifications).forEach(section => {
                if (_.isEmpty(specifications[section])) {
                    delete specifications[section]
                }
            })
        }
        return specifications
    }, [data, showDifferent])

    if (_.isEmpty(products)) {
        return <ErrorPage />
    }

    return (
        <Layout noCompare>
            <h2 className="text-xl font-bold mb-4">So sánh sản phẩm</h2>
            {isLoading ? (
                <div className="h-[400px] relative">
                    <LoadingPage />
                </div>
            )
                :
                <>
                    <div className="flex min-h-[160px]">
                        <div className="flex-1 text-sm font-medium">
                            So sánh <span className="font-bold">{data.map(product => product.name).join(' vs ')}</span>
                        </div>
                        {_.range(4).map(i => {
                            const product = data[i]
                            return (
                                <div className="flex-1">
                                    <div className="p-4 h-full relative">
                                        {!product ? (
                                            <div className="bg-gray-200 animate-pulse h-full rounded-md">
                                            </div>
                                        ) : (
                                            <div className="h-full select-none">
                                                <img src={product.images[0]} className="w-full max-h-40 object-contain" />
                                                {products.length !== 1 &&
                                                    <button
                                                        onClick={() => dispatch(removeCompare(product))}
                                                        className="absolute top-1 bg-white right-1 h-8 w-8 rounded-full border border-gray-200 shadow-md flex-center text-gray-400">
                                                        <AiOutlineClose size={20} />
                                                    </button>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex">
                        <div className="flex-1 px-4 py-2 text-sm font-semibold flex items-center">
                            <input id="different" checked={showDifferent} onChange={() => setShowDifferent(!showDifferent)} className="mr-2" type="checkbox" />
                            <label htmlFor="different">Chỉ hiện khác nhau</label>
                        </div>
                        {_.range(4).map(i => {
                            const product = data[i]
                            return (
                                <div className="flex-1 px-4 py-2">
                                    {product ? (
                                        <>
                                            <Link href={`/san-pham/${product.slug}`}>
                                                <a className="block font-medium text-sm">
                                                    {product.name}
                                                </a>
                                            </Link>
                                            <div className="font-semibold text-[13px]">
                                                {numberWithCommas(calcSingleItemPrice(product))}đ
                                                {product.discount !== 0 &&
                                                    <span className="ml-2 text-gray-500 line-through">{numberWithCommas(product.price)}đ</span>
                                                }
                                            </div>
                                        </>
                                    ) : null
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className="border-t border-b border-gray-300">
                        {Object.keys(specifications).map(section => (
                            <>
                                <div key={section} className="flex bg-gray-100 divide-x divide-gray-300 text-[17px]">
                                    <div className="flex-1 py-2 px-4 font-semibold">{section}</div>
                                    <div className="flex-1 py-2 px-4" />
                                    <div className="flex-1 py-2 px-4" />
                                    <div className="flex-1 py-2 px-4" />
                                    <div className="flex-1 py-2 px-4" />
                                </div>
                                {Object.keys(specifications[section]).map(spec => (
                                    <div className="flex divide-x divide-gray-300 text-[13px] mb-1 font-medium">
                                        <div className="flex-1 py-2 px-4 font-semibold text-sm">{spec}</div>
                                        <div className="flex-1 py-2 px-4 whitespace-pre-line">{specifications[section][spec][0] ?? ""}</div>
                                        <div className="flex-1 py-2 px-4 whitespace-pre-line">{specifications[section][spec][1] ?? ""}</div>
                                        <div className="flex-1 py-2 px-4 whitespace-pre-line">{specifications[section][spec][2] ?? ""}</div>
                                        <div className="flex-1 py-2 px-4 whitespace-pre-line">{specifications[section][spec][3] ?? ""}</div>
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                </>
            }
        </Layout >
    )
}