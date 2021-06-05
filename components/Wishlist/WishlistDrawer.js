import _ from 'lodash';
import Link from 'next/link';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css'
import { useEffect, useState } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { useAuth } from '../../lib/auth';
import firebase from '../../lib/firebase'
import numberWithCommas from '../../utils/numberWithCommas';
import { calcSingleItemPrice } from '../../utils/priceCalc';
import LoadingIcon from '../common/LoadingIcon';

export default function WishlistDrawer({ isOpen, onClose }) {
    const { auth } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        if (auth?.wishlist) {
            setLoading(true)
            try {
                const productsData = await Promise.all(auth.wishlist.map(async (wishlist) => {
                    const product = await firebase.firestore()
                        .collection('products')
                        .doc(wishlist)
                        .get()
                    if (product.exists) {
                        return product.data()
                    }
                    return null
                }))
                setProducts(productsData)
            } catch (err) {
                alert(err.message)
            }
            setLoading(false)
        } else {
            setProducts([])
        }
    }, [auth?.wishlist])

    return (
        <Drawer

            open={isOpen}
            onClose={onClose}
            width={350}
            level={null}
            handler={false}
            placement="right"
        >
            <div className="h-full flex flex-col">
                <div className="px-6 pt-6">
                    <button onClick={onClose}><IoCloseOutline size={25} /></button>
                </div>
                <h3 className="px-6 text-2xl font-semibold">Sản phẩm yêu thích</h3>
                <div className="mx-6 mt-2 h-px bg-gray-200" />
                {loading ? (
                    <div className="flex-1 flex-center">
                        <LoadingIcon />
                    </div>
                ) : _.isEmpty(products) ? (
                    <div className="flex-1 flex-center">
                        <FaHeartBroken size={60} />
                        <h2 className="mt-2 text-lg font-medium mx-10 text-center">Bạn chưa có sản phẩm yêu thích nào</h2>
                    </div>
                ) : (
                    <div className="flex-1 px-6 space-y-2 mt-2">
                        {products.map(product => (
                            <Link key={`wishlist${product.id}`} href={"/san-pham/" + product.slug}>
                                <a className="flex">
                                    <div className="w-14 h-14">
                                        <img src={product.images[0]} className="w-full h-full" />
                                    </div>
                                    <div className="p-2 ml-2">
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm font-semibold">{numberWithCommas(calcSingleItemPrice(product))}đ</div>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Drawer>
    )
}