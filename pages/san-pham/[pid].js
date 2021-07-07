import classNames from "classnames";
import _ from "lodash";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { store } from "react-notifications-component";
import StarRatings from 'react-star-ratings';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SwiperCore, { Thumbs } from 'swiper/core';
import Button from '../../components/common/Button';
import LoadingIcon from "../../components/common/LoadingIcon";
import ShowMore from "../../components/common/ShowMore";
import ProductCard from "../../components/Product/ProductCard";
import ProductImageGallery from "../../components/Product/ProductImageGallery";
import UserReview from "../../components/Product/UserReview";
import { categories } from "../../constants/category";
import { UserRole } from "../../constants/user";
import { useCart } from "../../contexts/cart";
import Layout from "../../layouts/Layout";
import { useAuth } from "../../lib/auth";
import { getProduct, getProducts, getUsers } from "../../lib/db";
import firebase from "../../lib/firebase";
import { firebaseAdmin } from '../../lib/firebase-admin';
import useAddWishlist from "../../lib/query/wishlist/useAddWishlist";
import useRemoveWishlist from "../../lib/query/wishlist/useRemoveWishlist";
import useWishlist from "../../lib/query/wishlist/useWishlist";
import numberWithCommas from '../../utils/numberWithCommas';
import { calcSingleItemPrice } from "../../utils/priceCalc";
import { Switch } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import { addCompare, removeCompare } from "../../lib/redux/slices/compareSlice";
import { useQueryClient } from "react-query";
import useCreateRating from "../../lib/query/rating/useCreateRating";
import TextareaAutosize from "react-textarea-autosize";

SwiperCore.use([Thumbs]);

export async function getServerSideProps({ params, req }) {
    const product = await getProduct(params.pid)

    if (!product) {
        return {
            notFound: true
        }
    }

    const variants = await getProducts({
        where: [{
            field: "modelSeries",
            op: "==",
            value: product.modelSeries
        }],
        order: [{
            field: "name",
            direct: "desc"
        }]
    })

    let related = await getProducts({
        where: [{
            field: "category",
            op: "==",
            value: product.category
        }, {
            field: "manufacturer",
            op: "==",
            value: product.manufacturer
        }, {
            field: firebase.firestore.FieldPath.documentId(),
            op: "!=",
            value: product.id
        }],
        limit: 5
    })

    const relatedLeft = 5 - related.length

    if (relatedLeft >= 1) {
        const newRelated = await getProducts({
            where: [{
                field: "category",
                op: "==",
                value: product.category
            }, {
                field: firebase.firestore.FieldPath.documentId(),
                op: "!=",
                value: product.id
            }],
            limit: relatedLeft
        })
        related = related.concat(newRelated)
    }

    const ratingsSnapshot = await firebaseAdmin
        .firestore()
        .collection('products')
        .doc(product.id)
        .collection('ratings')
        .get()

    let ratings = []
    if (!ratingsSnapshot.empty) {
        const userList = await getUsers({
            where: [{
                field: firebase.firestore.FieldPath.documentId(),
                op: "in",
                value: ratingsSnapshot.docs.map(rating => rating.id)
            }]
        })

        ratings = ratingsSnapshot.docs.map(rating => {
            const data = rating.data()
            const user = userList.find(user => user.id === rating.id)
            return {
                ...data,
                userFullName: user.name
            }
        })
    }
    return {
        props: {
            product, ratings, variants, related
        }
    }
}

const content = {
    DESCRIPTION: 'description',
    SPECIFICATION: 'specification',
    REVIEW: 'review'
}

export default function Product({ product, ratings, variants, related }) {
    const compare = useSelector(state => state.compare.products.some(compareProduct => compareProduct === product.id))
    const { append } = useCart()
    const { authUser: auth } = useAuth()
    const { data: wishlist } = useWishlist()
    const addWishlistMutate = useAddWishlist()
    const removeWishlistMutate = useRemoveWishlist()
    const createRatingMutate = useCreateRating()
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [ratingContent, setRatingContent] = useState('')
    const [showRating, setShowRating] = useState(3)
    const [showRatingLoading, setShowRatingLoading] = useState(false)
    const [showContent, setShowContent] = useState(content.DESCRIPTION)
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    const setCompare = () => {
        if (compare) {
            dispatch(removeCompare({ product, queryClient }))
        } else {
            dispatch(addCompare({ product, queryClient }))
        }
    }

    const isWishlisted = useMemo(() => {
        if (wishlist)
            return wishlist.some(wishlistProduct => product.id === wishlistProduct.id)
        else
            return false
    }, [wishlist])

    const onAppend = async () => {
        setLoading(true)
        await append(product)
        setLoading(false)
    }

    const onRating = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            store.addNotification({
                title: "Thất bại",
                message: "Vui lòng chọn điểm đánh giá!",
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
            return
        }

        const user = firebase.auth().currentUser
        const currentMillis = Date.now()
        const data = {
            pid: product.id,
            uid: user.uid,
            token: await user.getIdToken(),
            ratingDetails: product.ratingDetails,
            rating,
            content: ratingContent,
            created_at: currentMillis,
            updated_at: currentMillis
        }
        createRatingMutate.mutate(data, {
            onSettled: () => {
                setRating(0)
                setRatingContent('')
                createRatingMutate.reset()
            }
        })
    }

    const onWishlist = async (e) => {
        e.preventDefault()
        if (addWishlistMutate.isLoading || removeWishlistMutate.isLoading)
            return
        if (!auth) {
            alert("Vui lòng đăng nhập để sử dụng tính năng này!")
            return
        }
        if (!isWishlisted) {
            addWishlistMutate.mutate(product)
        } else {
            removeWishlistMutate.mutate(product)
        }
    }

    const onMoreRating = async () => {
        setShowRatingLoading(true)
        await new Promise(res => setTimeout(res, Math.floor(Math.random() * 1000 + 1000)))
        setShowRating(showRating + 3)
        setShowRatingLoading(false)
    }

    return (
        <Layout>
            <Head>
                <title>{product.name}</title>
            </Head>
            <div className="flex space-x-8 mt-4 mx-auto max-w-5xl mb-8">
                <div className="w-1/2">
                    <ProductImageGallery images={product.images} />
                </div>
                <div className="flex-1 p-3">
                    <div className="mb-1">
                        <Link href={"/" + product.category}>
                            <a className="underline font-medium">
                                {categories[product.category].name}
                            </a>
                        </Link>
                    </div>
                    <h3 className="text-4xl font-medium mb-1">{product.name}</h3>
                    <div className="mb-4">
                        <div className="inline-flex space-x-0.5 align-middle text-yellow-400">
                            <StarRatings
                                rating={product.avgRating}
                                starRatedColor="rgba(251, 191, 36)"
                                starEmptyColor="rgba(209, 213, 219)"
                                starDimension="20px"
                                starSpacing="1px"
                            />
                        </div>
                        <span className="ml-2 text-sm">({product.ratingCount} đánh giá)</span>
                    </div>
                    {product.discount === 0 ? (
                        <div className="mt-8 text-4xl font-normal text-gray-700 mb-4">
                            {numberWithCommas(product.price)}đ
                        </div>
                    ) : (
                        <>
                            <div className="mt-8 text-2xl font-normal text-gray-600 mb-4 line-through">
                                {numberWithCommas(product.price)}đ
                            </div>
                            <div className="text-4xl font-normal text-gray-700 mb-4">
                                {numberWithCommas(calcSingleItemPrice(product))}đ
                            </div>
                        </>
                    )}
                    {variants && variants.length > 1 && (
                        <div className="my-2 flex flex-wrap">
                            {variants.map(variant => (
                                <Link key={`variant${variant.name}`} href={`/san-pham/${variant.slug}`}>
                                    <a className={classNames("mr-2 p-2 text-[13px] font-medium mb-2", {
                                        "border-dark border-[1.75px]": variant.id === product.id,
                                        "hover:bg-gray-200 border-gray-300 border": variant.id !== product.id
                                    })}>
                                        {variant.name}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="w-8/12 mr-4 mb-3">
                        <Button disable={product.quantity === 0} onClick={onAppend} loading={loading} white>
                            {product.quantity !== 0 ? "THÊM VÀO GIỎ HÀNG" : "HẾT HÀNG"}
                        </Button>
                        {auth && auth.role !== UserRole.USER && (
                            <div>
                                <Link href={`/admin/products/${product.slug}`}>
                                    <a className="block btn dark mt-3">
                                        Chỉnh sửa sản phẩm
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>
                    <button onClick={onWishlist}>
                        {!(addWishlistMutate.isLoading || removeWishlistMutate.isLoading) ?
                            (isWishlisted
                                ? <AiFillHeart className='inline-block' size={24} />
                                : <AiOutlineHeart className='inline-block' size={24} />)
                            : <LoadingIcon />
                        }
                        <span className="ml-2 text-sm font-medium align-middle">
                            {isWishlisted ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
                        </span>
                    </button>
                    <div className="mt-2">
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch
                                    checked={compare}
                                    onChange={setCompare}
                                    className={`${compare ? 'bg-dark' : 'bg-gray-200'}
                                    relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none`}
                                >
                                    <span
                                        className={`${compare ? 'translate-x-5' : 'translate-x-1'
                                            } inline-block w-3 h-3 transform bg-white rounded-full transition-transform`}
                                    />
                                </Switch>
                                <Switch.Label className="ml-2 text-sm font-medium">So sánh</Switch.Label>
                            </div>
                        </Switch.Group>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <div className="flex">
                    {[{ title: "Mô tả sản phẩm", value: content.DESCRIPTION },
                    { title: "Thông số sản phẩm", value: content.SPECIFICATION },
                    { title: "Đánh giá", value: content.REVIEW }].map(section => (
                        <button
                            key={`section${section.title}`}
                            className={classNames("py-2 px-6 rounded-none", {
                                "bg-black text-white font-medium": showContent === section.value
                            })}
                            onClick={() => setShowContent(section.value)}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
                <div className="h-[1.5px] bg-black"></div>
            </div>
            <div className="bg-gray-100 py-3 px-2">
                <SwitchTransition>
                    <CSSTransition timeout={120} key={showContent}
                        addEndListener={(node, done) => {
                            node.addEventListener("transitionend", done, false);
                        }}
                        classNames="fade">
                        <div>
                            {showContent === content.DESCRIPTION &&
                                <div className="unreset px-4 text-justify">
                                    <ShowMore height={400}>
                                        <div className="mce">
                                            {ReactHtmlParser(product.description)}
                                        </div>
                                    </ShowMore>
                                </div>
                            }
                            {showContent === content.SPECIFICATION &&
                                <ShowMore height={400}>
                                    <div className="px-4 bg-gray-100 space-y-1 divide-y divide-gray-300">
                                        {product.specifications && product.specifications.map(section => (
                                            <div key={section.name} className="py-2">
                                                <div className="text-xl font-bold mb-2 text-black">{section.name}</div>
                                                <div className="space-y-2 text-[15px]">
                                                    {section.specs.map(spec => {
                                                        const splittedDetail = spec.detail.split('\n')
                                                        return (
                                                            <div key={spec.title} className="font-semibold flex">
                                                                <div className="text-gray-500 w-60">{spec.title}:</div>
                                                                {splittedDetail.length === 1 && <div className="text-gray-800">{spec.detail}</div>}
                                                                {splittedDetail.length > 1 && (
                                                                    <ul className="text-gray-800">
                                                                        {splittedDetail.map((detail, index) => (
                                                                            <li key={section.name + spec.title + index} className="list-disc list-inside">{detail}</li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ShowMore>
                            }
                            {showContent === content.REVIEW &&
                                (<>
                                    <h2 className="pl-3 text-xl font-semibold">Đánh giá {product.name}</h2>
                                    <div className="flex space-x-6 mb-2">
                                        <div className="flex-1 p-3">
                                            <div className="mb-4">
                                                <span className="text-yellow-500 mr-2 align-middle text-lg font-bold">
                                                    {product.avgRating}
                                                </span>
                                                <StarRatings
                                                    rating={product.avgRating}
                                                    starDimension="18px"
                                                    starSpacing="2px"
                                                    starRatedColor="rgb(245,158,11)"
                                                    starHoverColor="rgb(245,158,11)"
                                                    starEmptyColor="rgb(209,209,209)"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-600 align-middle">{product.ratingCount} đánh giá</span>
                                            </div>
                                            {_.range(5, 0).map(number => {
                                                const ratingValueCount = product?.ratingDetails?.[number] ?? 0

                                                return (
                                                    <div key={`rating${number}value`} className="flex items-center mb-1">
                                                        <span className="mr-1 text-sm leading-4 align-middle font-medium w-2 text-center">{number}</span> <AiFillStar className="translate-y-px" size={12} />
                                                        <div className="w-[200px] h-1 bg-gray-300 mx-2 translate-y-px relative">
                                                            <div style={{ width: (ratingValueCount / product.ratingCount) * 100 + "%" }} className="absolute bg-yellow-500 h-full"></div>
                                                        </div>
                                                        <span className="text-[13px] font-semibold">{ratingValueCount}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="flex-1">
                                            {!auth ? (
                                                <div className="bg-gray-100 p-3">
                                                    Đăng nhập để đánh giá sản phẩm!
                                                </div>
                                            ) : (
                                                <form onSubmit={onRating} className="relative bg-gray-100 p-3 text-sm font-semibold space-y-2">
                                                    <div>
                                                        <div className="mb-2">Điểm số:</div>
                                                        <StarRatings
                                                            rating={rating}
                                                            starDimension="25px"
                                                            starRatedColor="rgb(255,208,85)"
                                                            starHoverColor="rgb(255,208,85)"
                                                            starEmptyColor="rgb(209,209,209)"
                                                            changeRating={createRatingMutate.isLoading ? null : setRating}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="mb-2">Nhận xét:</div>
                                                        <TextareaAutosize required minRows={3} maxRows={8} minLength={20}
                                                            value={ratingContent} onChange={e => setRatingContent(e.target.value)}
                                                            placeholder="Tối thiểu 20 kí tự" disabled={createRatingMutate.isLoading}
                                                            className="resize-none w-full shadow p-3 text-gray-600"
                                                        />
                                                    </div>
                                                    <div className="w-24 ml-auto">
                                                        <Button disable={createRatingMutate.isLoading}>
                                                            {createRatingMutate.isLoading ? <LoadingIcon /> : "Đăng"}
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                    <div className="divide-y-2">
                                        {ratings.length === 0 ? (
                                            <div className="h-40 flex-center font-medium text-xl">
                                                Chưa có đánh giá
                                            </div>
                                        ) :
                                            ratings.slice(0, showRating).map(rating => (<UserReview rating={rating} />))
                                        }
                                    </div>
                                    {showRating < ratings.length &&
                                        <div className="max-w-md mx-auto">
                                            <Button loading={showRatingLoading} onClick={onMoreRating} white>
                                                Tải thêm
                                            </Button>
                                        </div>
                                    }
                                </>)
                            }
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Các sản phẩm tương tự</h4>
                <div className="flex -mx-2">
                    {_.range(5).map(index => {
                        const product = related[index]
                        if (!product) {
                            return (
                                <div key={`related${index}`} className="w-full h-full"></div>
                            )
                        }

                        return <ProductCard key={`related${product.id}`} product={product} />
                    })}
                </div>
            </div>
        </Layout >
    )
}