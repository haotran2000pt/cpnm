import _ from 'lodash';
import Link from 'next/link';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { FaHeartBroken, FaTrash } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { useAuth } from '../../lib/auth';
import useRemoveWishlist from '../../lib/query/wishlist/useRemoveWishlist';
import useWishlist from '../../lib/query/wishlist/useWishlist';
import numberWithCommas from '../../utils/numberWithCommas';
import { calcSingleItemPrice } from '../../utils/priceCalc';
import LoadingIcon from '../common/LoadingIcon';

export default function WishlistDrawer({ isOpen, onClose }) {
    const { authUser } = useAuth()
    const { data, isLoading } = useWishlist()
    const [deleteProductId, setDeleteProductId] = useState('')
    const removeWishlistMutate = useRemoveWishlist()

    if (!authUser) {
        return null
    }

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
                {isLoading ? (
                    <div className="flex-1 flex-center">
                        <LoadingIcon />
                    </div>
                ) : _.isEmpty(data) ? (
                    <div className="flex-1 flex-center">
                        <FaHeartBroken size={60} />
                        <h2 className="mt-2 text-lg font-medium mx-10 text-center">Bạn chưa có sản phẩm yêu thích nào</h2>
                    </div>
                ) : (
                    <div className="flex-1 px-6 space-y-2 mt-2">
                        {data.map(product => (
                            <div key={`wishlist${product.id}`} className="flex">
                                <Link href={"/san-pham/" + product.slug}>
                                    <a className="flex-1 flex">
                                        <div className="w-14 h-14 flex-shrink-0">
                                            <img src={product.images[0]} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="mb-2 ml-4">
                                            <div className="font-medium text-sm">{product.name}</div>
                                            <div className="text-[13px] font-semibold">{numberWithCommas(calcSingleItemPrice(product))}đ</div>
                                        </div>
                                    </a>
                                </Link>
                                <div className="w-8 ml-4 flex-shrink-0 pt-2">
                                    <button onClick={() => {
                                        setDeleteProductId(product.id)
                                        if (removeWishlistMutate.isLoading)
                                            return
                                        removeWishlistMutate.mutate(product)
                                    }}>
                                        {removeWishlistMutate.isLoading && deleteProductId === product.id
                                            ? <LoadingIcon />
                                            : <BiTrash size={20} />
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Drawer>
    )
}