import classNames from "classnames"
import moment from "moment"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { GoAlert } from "react-icons/go"
import { store } from "react-notifications-component"
import firebase from '../../lib/firebase'
import numberWithCommas from "../../utils/numberWithCommas"
import { calcSingleItemPrice } from "../../utils/priceCalc"
import BetterReactModal from "../common/BetterReactModal"
import Button from '../common/Button'
import LoadingIcon from "../common/LoadingIcon"

const Left = ({ children }) => <div className="w-32 flex-shrink-0 font-semibold">{children}</div>
const Right = ({ children }) => <div className="flex-auto whitespace-pre-line">{children}</div>

const UserOrderModal = ({ order, onClose }) => {
    const [cancel, setCancel] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const router = useRouter()
    if (!order) return null

    const onCancel = async () => {
        if (cancelLoading) return
        setCancelLoading(true)
        try {
            await firebase.firestore().collection('orders').doc(order.id).update({
                status: "Đã hủy",
                history: [{
                    created_at: Date.now(),
                    status: "Đơn hàng đã bị hủy"
                }, ...order.history]
            })
            store.addNotification({
                title: "Thành công",
                message: "Đơn hàng đã bị hủy",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
            router.reload()

        } catch (err) {
            alert(err.message)
        }
        setCancelLoading(false)
    }

    return (
        <div style={{ width: 620 }} className="bg-white border shadow-md">
            <div className="flex justify-between items-center mx-4 py-4 mb-2 border-b">
                <h3 className="text-lg font-semibold">
                    Đơn hàng # {order.id}
                </h3>
                <button onClick={onClose}><AiOutlineClose size={25} /></button>
            </div>
            {/* Thong tin khach hang */}
            <div className="mx-8 my-2 space-y-2 pb-2 text-sm border-b">
                <div className="text-lg">Thông tin khách hàng</div>
                <div className="flex">
                    <Left>Tên khách hàng:</Left>
                    <Right>{order.name}</Right>
                </div>
                <div className="flex">
                    <Left>Số điện thoại:</Left>
                    <Right>{order.phone}</Right>
                </div>
                <div className="flex">
                    <Left>Địa chỉ:</Left>
                    <Right>{order.street}, {order.ward}, {order.district}, {order.city}</Right>
                </div>
                <div className="flex">
                    <Left>Email:</Left>
                    <Right>{order?.email || <span className="italic">Không có</span>}</Right>
                </div>
            </div>
            {/* Thong tin don hang */}
            <div className="mx-8 my-2 space-y-2 pb-2 text-sm border-b">
                <div className="text-lg">Thông tin đơn hàng</div>
                <div className="flex">
                    <div className="space-y-2">
                        <div className="flex">
                            <Left>Trạng thái:</Left>
                            <Right>{order.status}</Right>
                        </div>
                        <div className="flex">
                            <Left>Ngày đặt:</Left>
                            <Right>{moment(order.created_at).format('DD/MM/YYYY')}</Right>
                        </div>
                        <div className="flex">
                            <Left>Ghi chú:</Left>
                            <Right>{order?.description || <span className="italic">Không có</span>}</Right>
                        </div>
                    </div>
                    <div className="w-px flex-shrink-0 bg-gray-200 mx-2" />
                    <div className="flex-1 space-y-2">
                        {order.history.map((history, index) => (
                            <div className="flex items-center font-medium">
                                <div className={classNames('w-2 h-2 rounded-full mr-2', {
                                    'bg-gray-700': index === 0,
                                    'bg-gray-200': index !== 0
                                })} />
                                <div className="w-32">{moment(history.created_at).format('HH:mm DD-MM-YYYY')}</div>
                                <div>{history.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-3 bg-gray-100">
                    <table className="w-full">
                        <tr>
                            <th className="pb-2">Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                        </tr>
                        <tbody>
                            {order.items.map(item => (
                                <tr className="font-semibold py-2">
                                    <td className="flex pb-2">
                                        <div className="w-16 h-16">
                                            <img src={item.product.images[0]} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex items-center mx-2">{item.product.name}</div>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{numberWithCommas(calcSingleItemPrice(item.product) * item.quantity)}đ</td>
                                </tr>
                            ))}
                            <tr className="font-bold text-xl">
                                <td />
                                <td className="p-4">
                                    TỔNG:
                                </td>
                                <td>
                                    {numberWithCommas(order.totalPrice)}đ
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="justify-end space-x-4 mx-8 mb-2 text-sm flex">
                <button onClick={onClose} className="p-2 font-bold text-gray-500">
                    Đóng
                </button>
                {order.status === 'Chờ xác nhận' &&
                    <div className="w-24">
                        <Button onClick={() => setCancel(true)}>
                            Hủy đơn
                        </Button>
                    </div>
                }
            </div>
            <BetterReactModal
                isOpen={cancel}
                onClose={() => setCancel(false)}
                preventClose={cancelLoading}
            >
                <div className="bg-white relative">
                    {cancelLoading &&
                        <div className="absolute inset-0 flex-center bg-dark bg-opacity-20">
                            <LoadingIcon />
                        </div>
                    }
                    <h4 className="font-bold mb-1 text-red-600 py-4 px-8">
                        <GoAlert className="inline-block mr-1" /> <span className="align-middle">Xác nhận hủy đơn hàng</span>
                    </h4>
                    <div className="py-6 px-8 text-sm">
                        <div className="font-semibold text-gray-500 mb-4">Thao tác này sẽ hủy đơn hàng và không thể hoàn tác!</div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setCancel(false)}
                                className="font-semibold text-gray-500"
                            >
                                Đóng
                            </button>
                            <div className="w-24">
                                <Button onClick={onCancel}>
                                    Hủy đơn
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </BetterReactModal>
        </div>
    )
}

export default UserOrderModal