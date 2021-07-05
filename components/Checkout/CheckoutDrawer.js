import Link from 'next/link';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css'
import { AiOutlineClose } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5';
import { useCart } from '../../contexts/cart';
import numberWithCommas from '../../utils/numberWithCommas';
import { calcListItemPrice, calcSingleItemPrice } from '../../utils/priceCalc';
import { LoadingPage } from '../common/LoadingPage';
import CheckoutEmpty from './CheckoutEmpty'

export default function CheckoutDrawer({ isOpen, onClose }) {
    const { items, increase, decrease, remove, isLoading } = useCart()

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            width={350}
            level={null}
            handler={false}
            placement='right'
        >
            <div className="h-full flex flex-col">
                <div className="px-6 pt-6">
                    <button onClick={onClose}><IoCloseOutline size={25} /></button>
                </div>
                <h3 className="px-6 text-2xl font-semibold">Giỏ hàng</h3>
                <div className="mx-6 mt-2 h-px bg-gray-200" />
                {isLoading ? <div className="flex-1 relative"><LoadingPage /></div>
                    : items.length === 0 ? <div className="px-6 flex-1 flex-center"><CheckoutEmpty noMessage /></div>
                        :
                        <>
                            <div className="flex-1 px-6">
                                {items.map(item => {
                                    return (
                                        <div className="py-4 flex text-sm font-bold">
                                            <div className="w-16 h-16">
                                                <img className="object-contain max-w-full max-h-full"
                                                    src={item.product.images[0]} />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between px-2">
                                                <div>
                                                    <Link href={`/san-pham/${item.product.slug}`}>
                                                        <a>
                                                            {item.product.name}
                                                        </a>
                                                    </Link>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <button onClick={() => decrease(item.product)} className="font-bold text-lg">-</button>
                                                    <span>{' '}{item.quantity}{' '}</span>
                                                    <button onClick={() => increase(item.product)} className="font-bold text-lg">+</button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between px-2 ml-1">
                                                <div className="">{numberWithCommas(calcSingleItemPrice(item.product) * item.quantity)}đ</div>
                                                <button className="text-right font-semibold" onClick={() => remove(item.product.id)}>Xóa</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mb-6 px-6">
                                <div className="w-full h-px bg-gray-200" />
                                <div className="flex justify-between">
                                    <div>Tổng tiền</div>
                                    <div>
                                        {numberWithCommas(calcListItemPrice(items))}đ
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <Link href='/checkout'>
                                    <a className="block btn dark">
                                        THANH TOÁN
                                    </a>
                                </Link>
                            </div>
                        </>
                }
            </div>
        </Drawer>
    )
}