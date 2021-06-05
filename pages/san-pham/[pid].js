import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Layout from "../../layouts/Layout";
import SwiperCore, { Thumbs } from 'swiper/core';
import ProductImageGallery from "../../components/Product/ProductImageGallery";
import Button from '../../components/common/Button'
import ProductCard from "../../components/Product/ProductCard";
import UserReview from "../../components/Product/UserReview";
import { firebaseAdmin } from '../../lib/firebase-admin'
import { categories } from "../../constants/category";
import numberWithCommas from '../../utils/numberWithCommas'
import Head from 'next/head'
import { useCart } from "../../contexts/cart";
import StarRatings from 'react-star-ratings';
import { store } from "react-notifications-component";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import firebase from "../../lib/firebase";
import LoadingIcon from "../../components/common/LoadingIcon";
import _ from "lodash";
import { useRouter } from "next/router";

SwiperCore.use([Thumbs]);

export async function getStaticPaths() {
    const products = await firebaseAdmin.firestore().collection('products').get()
    const paths = products.docs.map(product => ({
        params: { pid: product.data().slug }
    }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const res = await firebaseAdmin.firestore().collection('products').where("slug", "==", params.pid).get()
    const product = { id: res.docs[0].id, ...res.docs[0].data() }
    const ratingsSnapshot = await firebaseAdmin
        .firestore()
        .collection('ratings')
        .where("productId", "==", res.docs[0].id)
        .orderBy('created_at', 'desc')
        .get()

    const ratings = await Promise.all(ratingsSnapshot.docs.map(async (rating) => {
        const data = rating.data()
        const user = await firebaseAdmin.firestore().collection('users').doc(data.uid).get()
        return {
            ...rating.data(),
            userFullName: user.data().name
        }
    }))

    return {
        props: {
            product, ratings
        }
    }
}

export default function Product({ product, ratings }) {
    const { append } = useCart()
    const { auth } = useAuth()
    const [loading, setLoading] = useState(false)
    const [ratingLoading, setRatingLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [ratingContent, setRatingContent] = useState('')
    const [showRating, setShowRating] = useState(3)
    const [showRatingLoading, setShowRatingLoading] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const router = useRouter()
    const isWishlisted = auth ? auth.wishlist.includes(product.id) : false

    const onAppend = async () => {
        setLoading(true)
        await new Promise(res => setTimeout(res, 1000))
        append(product)
        store.addNotification({
            title: "Thành công",
            message: "Sản phẩm đã được thêm vào giỏ hàng",
            type: "success",
            insert: "top",
            container: "bottom-right",
            dismiss: {
                duration: 2500,
                onScreen: true
            }
        })
        setLoading(false)
    }

    const onRating = async (e) => {
        e.preventDefault()
        setRatingLoading(true)
        try {
            const rated = await firebase.firestore().collection('ratings').where('uid', '==', auth.id).get()

            const batch = firebase.firestore().batch();
            const productRef = firebase.firestore().collection('products').doc(product.id)

            if (rated.empty) {
                const ratingRef = firebase.firestore().collection('ratings').doc()
                batch.set(ratingRef, {
                    rating,
                    content: ratingContent,
                    uid: auth.id,
                    productId: product.id,
                    created_at: Date.now()
                })
                const productRating = await firebase.firestore().collection('ratings').where('productId', '==', product.id).get()
                const newRating = (productRating.docs.reduce((acc, cur) => (acc + cur.data().rating), 0) + rating) / (productRating.docs.length + 1)
                batch.update(productRef, { ratingCount: productRating.docs.length + 1, avgRating: _.isNaN(newRating) ? 0 : newRating })
            } else {
                const ratingRef = firebase.firestore().collection('ratings').doc(rated.docs[0].id)
                batch.update(ratingRef, {
                    rating,
                    content: ratingContent,
                    created_at: Date.now()
                })
                const productRating = await firebase.firestore()
                    .collection('ratings')
                    .where('productId', '==', product.id)
                    .where('uid', '!=', auth.id)
                    .get()
                const newRating = (productRating.docs.reduce((acc, cur) => (acc + cur.data().rating), 0) + rating) / (productRating.docs.length + 1)
                batch.update(productRef, { avgRating: _.isNaN(newRating) ? 0 : newRating })
            }
            batch.commit()

            store.addNotification({
                title: "Thành công",
                message: "Đánh giá sản phẩm thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
            setRatingContent('')
            setRating(0)
            router.reload()
        } catch (err) {
            console.log(err.message)
            alert(err.message)
        }
        setRatingLoading(false)
    }

    const onWishlist = async (e) => {
        e.preventDefault()
        if (wishlistLoading)
            return
        if (!auth) {
            alert("Vui lòng đăng nhập để sử dụng tính năng này!")
            return
        }
        setWishlistLoading(true)
        try {
            let newWishlistData
            if (!isWishlisted) {
                newWishlistData = [...auth.wishlist, product.id]
            } else {
                newWishlistData = _.without(auth.wishlist, product.id)
            }

            await firebase.firestore()
                .collection('users')
                .doc(auth.id)
                .update({ wishlist: newWishlistData })
        } catch (err) {
            alert(err.message)
        }
        setWishlistLoading(false)
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
                    <Link href={"/" + product.category}>
                        <a className="underline font-medium mb-1 block">
                            {categories[product.category].name}
                        </a>
                    </Link>
                    <h3 className="text-4xl font-medium mb-1">{product.name}</h3>
                    <div className="mb-4">
                        <div className="inline-flex space-x-0.5 align-middle text-yellow-400">
                            <StarRatings
                                rating={product.avgRating}
                                starRatedColor="rgba(251, 191, 36)"
                                starEmptyColor="rgba(209, 213, 219)"
                                starDimension="20px"
                                starSpacing="2px"
                                isAggregateRating={true}
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
                                {numberWithCommas(product.price - Math.floor(product.price * product.discount / 100))}đ ({product.discount}%)
                            </div>
                        </>
                    )}
                    <div className="w-8/12 mr-4 mb-3">
                        <Button onClick={onAppend} loading={loading} white>
                            THÊM VÀO GIỎ HÀNG
                        </Button>
                    </div>
                    <button onClick={onWishlist}>
                        {!wishlistLoading ?
                            (isWishlisted
                                ? <AiFillHeart className='inline-block' size={24} />
                                : <AiOutlineHeart className='inline-block' size={24} />)
                            : <LoadingIcon />
                        }
                        <span className="ml-2 text-sm font-medium align-middle">
                            {isWishlisted ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
                        </span>
                    </button>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Mô tả sản phẩm</h4>
                <div className="py-2 px-4 text-justify font-medium max-w-3xl bg-gray-100 space-y-1 divide-y whitespace-pre-line">
                    {product.description}
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Thông số kỹ thuật</h4>
                <div className="px-8 py-2 bg-gray-100 max-w-3xl space-y-1">
                    {product.specifications && product.specifications.map(spec => (
                        <div className="flex py-1">
                            <div className="w-1/2 flex-shrink-0 flex items-center">{spec.name}:</div>
                            <div className="font-semibold">{spec.info}</div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
                <h4 className="text-xl font-bold mb-2">Các sản phẩm tương tự</h4>
                <div className="flex -mx-2">
                    <ProductCard product={product} />
                    <ProductCard product={product} />
                    <ProductCard product={product} />
                    <ProductCard product={product} />
                    <ProductCard product={product} />
                </div>
            </div>
            <hr className="mb-4" />
            <div className="mb-2 max-w-3xl">
                <h4 className="text-xl font-bold mb-2">Đánh giá</h4>
                {!auth ? (
                    <div className="bg-gray-100 p-3 mb-2">
                        Đăng nhập để đánh giá sản phẩm!
                    </div>
                ) : (
                    <form onSubmit={onRating} className="relative bg-gray-100 p-3 text-sm font-semibold space-y-2">
                        {ratingLoading &&
                            <div className="absolute inset-0 flex-center z-10 bg-dark bg-opacity-20">
                                <LoadingIcon />
                            </div>
                        }
                        <div>
                            <div className="mb-2">Điểm số:</div>
                            <StarRatings
                                rating={rating}
                                starDimension="25px"
                                starRatedColor="rgb(255,208,85)"
                                starHoverColor="rgb(255,208,85)"
                                starEmptyColor="rgb(209,209,209)"
                                changeRating={setRating}
                            />
                        </div>
                        <div>
                            <div className="mb-2">Nhận xét:</div>
                            <textarea required rows={3} minLength={20}
                                value={ratingContent} onChange={e => setRatingContent(e.target.value)}
                                placeholder="Tối thiểu 20 kí tự"
                                className="resize-none w-full shadow p-3 text-gray-600"></textarea>
                        </div>
                        <div className="w-24 ml-auto">
                            <Button>Đăng</Button>
                        </div>
                    </form>
                )}
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
            </div>
        </Layout>
    )
}