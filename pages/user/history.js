import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import BetterReactModal from '../../components/common/BetterReactModal'
import LoadingIcon from '../../components/common/LoadingIcon'
import UserOrderModal from '../../components/Order/UserOrderModal'
import UserLayout from '../../layouts/UserLayout'
import { useAuth } from '../../lib/auth'
import firebase from '../../lib/firebase'
import numberWithCommas from '../../utils/numberWithCommas'

export default function UserHistory() {
    const [orders, setOrders] = useState(null)
    const [showOrder, setShowOrder] = useState(null)
    const { auth } = useAuth()

    useEffect(async () => {
        if (auth) {
            const res = await firebase.firestore()
                .collection('orders')
                .where('uid', '==', auth.id)
                .get()
            const data = res.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setOrders(data)
        }
    }, [auth])

    return (
        <UserLayout>
            <div className="border border-gray-400 shadow-md p-2">
                <h2 className="text-xl font-medium border-b pb-2 mb-2">Lịch sử mua hàng</h2>
                {!orders ? (
                    // Loading
                    <div className="h-60 flex-center">
                        <LoadingIcon />
                    </div>
                ) : orders.length === 0 ? (
                    // Trống
                    <div className="h-60 flex-center text-gray-600">
                        <div>
                            <AiOutlineShoppingCart size={50} />
                        </div>
                        <h3 className="text-2xl mt-2 font-medium">Bạn chưa có đơn hàng nào</h3>
                    </div>
                ) : (
                    // Danh sach
                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th width="220">Mã đơn hàng</th>
                                    <th>Tên khách hàng</th>
                                    <th>Trạng thái</th>
                                    <th>Tổng giá</th>
                                    <th>Ngày đặt</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr>
                                        <td className="py-2 text-blue-700 font-medium">{order.id}</td>
                                        <td>{order.name}</td>
                                        <td>{order.status}</td>
                                        <td>{numberWithCommas(order.totalPrice)}đ</td>
                                        <td>{moment(order.created_at).format('DD-MM-YYYY')}</td>
                                        <td>
                                            <button
                                                onClick={() => setShowOrder(order)}
                                                className="font-semibold"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <BetterReactModal
                    isOpen={showOrder}
                    onClose={() => setShowOrder(null)}
                    preventClose={true}
                >
                    <UserOrderModal onClose={() => setShowOrder(null)} order={showOrder} />
                </BetterReactModal>
            </div>
        </UserLayout>
    )
}