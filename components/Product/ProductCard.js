import Link from 'next/link'
import LazyLoad from 'react-lazyload'
import numberWithCommas from '../../utils/numberWithCommas'
import { calcSingleItemPrice } from '../../utils/priceCalc'
import StarRatings from 'react-star-ratings';

export default function ProductCard({ product }) {
    return (
        <Link href={'/san-pham/' + product?.slug || '0'}>
            <a style={{ height: 335 }} className="w-full h-full px-2 mb-4 group select-none block">
                <div className="bg-gray-100 p-3 relative h-full">
                    <div className="h-52 mb-4 flex items-center justify-center group-hover:scale-105 transform transition-transform duration-500">
                        <LazyLoad height={144}>
                            <img className="h-36 w-auto object-contain"
                                src={product.images[0]}
                                alt="product"
                            />
                        </LazyLoad>
                    </div>
                    <div>
                        <div className="inline-flex items-center absolute -translate-y-6 translate-x-2">
                            <div>
                                <StarRatings
                                    rating={product.avgRating}
                                    starRatedColor="rgba(251, 191, 36)"
                                    starEmptyColor="rgba(209, 213, 219)"
                                    starDimension="14px"
                                    starSpacing="2px"
                                    isAggregateRating={true}
                                />
                            </div>
                            <span className="ml-1 text-[13px] font-bold text-gray-600 translate-y-0.5">{product.avgRating} ({product.ratingCount})</span>
                        </div>
                        <div>
                            <h3 className="font-bold py-1 px-2 inline-block group-hover:bg-dark transition-colors group-hover:text-white duration-200">
                                {product?.name || "iPhone X 64GB"}
                            </h3>
                        </div>
                        <div>
                            <div style={{ fontSize: 15 }} className="py-1 px-2 group-hover:text-white duration-200 group-hover:bg-dark inline-block font-semibold">
                                <span className="inline-block">
                                    {numberWithCommas(calcSingleItemPrice(product))}đ
                                </span>
                                {product.discount !== 0 && (
                                    <span className="ml-2 text-gray-400 inline-block group-hover:text-white duration-200 line-through">
                                        {numberWithCommas(product.price)}đ
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}