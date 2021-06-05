import classNames from "classnames"
import moment from "moment"
import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { GoAlert } from "react-icons/go"
import numberWithCommas from "../../../utils/numberWithCommas"
import { calcListItemPrice, calcSingleItemPrice } from "../../../utils/priceCalc"
import BetterReactModal from "../../common/BetterReactModal"
import LoadingIcon from "../../common/LoadingIcon"
import firebase from '../../../lib/firebase'
import { productStatus } from "../../../constants/product"
import _ from "lodash"

const Left = ({ children }) => <div className="w-28 flex-shrink-0 font-semibold text-blue-800">{children}</div>
const Right = ({ children }) => <div className="flex-auto whitespace-pre-line">{children}</div>

const OrderModal = ({ order, onClose, refetch }) => {
    const [update, setUpdate] = useState('')
    const [updateLoading, setUpdateLoading] = useState(false)
    if (!order) return null

    const onCancel = () => {
        return firebase.firestore().collection('orders').doc(order.id).update({
            status: "Đã hủy",
            history: [{
                created_at: Date.now(),
                status: "Đơn hàng đã bị hủy"
            }, ...order.history]
        })
    }

    const onUpdate = async (status) => {
        let text
        const batch = firebase.firestore().batch()
        try {
            switch (status) {
                case 'Đã xác nhận':
                    text = 'Shop đã xác nhận đơn hàng'
                    break;
                case 'Đang giao hàng':
                    text = 'Đơn hàng đang được giao'
                    break;
                case 'Đã giao':
                    await Promise.all(order.items.map(async (item) => {
                        const increment = firebase.firestore.FieldValue.increment(item.quantity)
                        const productRef = firebase.firestore().collection('products')
                            .doc(item.product.id)
                        batch.update(productRef, {
                            soldUnits: increment
                        })
                    }))
                    text = 'Giao hàng thành công'
                    break;
            }

            const orderRef = firebase.firestore().collection('orders').doc(order.id)
            batch.update(orderRef, {
                status,
                history: [{
                    created_at: Date.now(),
                    status: text
                }, ...order.history]
            })

            batch.commit()
        } catch (err) {
            console.log(err)
            alert(err.message)
        }

    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (updateLoading) return
        setUpdateLoading(true)
        try {
            switch (update) {
                case 'CANCEL': {
                    await onCancel()
                    break;
                }
                case 'UPDATE': {
                    await onUpdate(e.target.status.value)
                    break;
                }
            }
            onClose()
            refetch()
        } catch (err) {
            alert(err.message)
        }
        setUpdateLoading(false)
    }

    return (
        <div style={{ width: 620 }} className="bg-white border rounded-xl shadow-md">
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
                    <div className="w-2/5 flex-shrink-0 space-y-2">
                        <div className="flex">
                            <Left>Trạng thái:</Left>
                            <Right>{order.status}</Right>
                        </div>
                        <div className="flex">
                            <Left>Ngày đặt:</Left>
                            <Right>{moment(order.created_at).format('DD/MM/YYYY')}</Right>
                        </div>
                        {order.status === 'Đã giao' &&
                            <div className="flex">
                                <Left>Ngày giao:</Left>
                                <Right>{moment(order.history[0].created_at).format('DD/MM/YYYY')}</Right>
                            </div>
                        }
                        <div className="flex">
                            <Left>Ghi chú:</Left>
                            <Right>{order?.description || <span className="italic">Không có</span>}</Right>
                        </div>
                    </div>
                    <div className="w-px flex-shrink-0 bg-gray-200 mx-2" />
                    <div className="w-3/5 flex-shrink-0 space-y-2">
                        {order.history.map((history, index) => (
                            <div className="flex items-center font-medium">
                                <div className={classNames('w-2 h-2 rounded-full mr-2', {
                                    'bg-blue-500': index === 0,
                                    'bg-gray-200': index !== 0
                                })} />
                                <div className="w-32">{moment(history.created_at).format('HH:mm DD-MM-YYYY')}</div>
                                <div className={index === 0 ? "text-blue-600" : ""}>{history.status}</div>
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
                                        <div className="flex items-center ml-2">{item.product.name}</div>
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
                                    {numberWithCommas(calcListItemPrice(order.items))}đ
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-right space-x-4 mx-8 mb-2 text-sm">
                {
                    order.status === 'Đã hủy' || order.status === 'Đã giao' ? (
                        <button onClick={onClose} className="p-2 font-bold text-gray-500 hover:bg-gray-300 bg-gray-200 w-24 rounded-md">
                            Đóng
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setUpdate('CANCEL')} className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold">
                                Hủy đơn
                            </button>
                            <button onClick={() => setUpdate('UPDATE')} className="p-2 rounded-md text-blue-600 font-semibold" >
                                Cập nhật trạng thái
                            </button>
                        </>
                    )}
            </div>
            <BetterReactModal
                isOpen={update}
                onClose={() => setUpdate('')}
                preventClose={updateLoading}
            >
                <div className="bg-white rounded-2xl overflow-hidden relative">
                    {updateLoading &&
                        <div className="absolute inset-0 flex-center bg-dark bg-opacity-20">
                            <LoadingIcon />
                        </div>
                    }
                    {update === 'CANCEL' && (
                        <>
                            <h4 className="font-bold mb-1 bg-red-100 text-red-700 py-4 px-8">
                                <GoAlert className="inline-block mr-1" /> <span className="align-middle">Xác nhận hủy đơn hàng</span>
                            </h4>
                            <div className="py-6 px-8 text-sm">
                                <div className="font-semibold text-gray-500 mb-4">Thao tác này sẽ hủy đơn hàng và không thể hoàn tác!</div>
                                <div className="text-right space-x-4">
                                    <button
                                        onClick={() => setUpdate('')}
                                        className="font-semibold text-gray-500"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        disabled={updateLoading}
                                        onClick={handleUpdate}
                                        className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold"
                                    >
                                        Hủy đơn
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {update === 'UPDATE' && (
                        <>
                            <h4 className="font-bold mb-1 bg-blue-100 text-blue-700 py-4 px-8">
                                Cập nhật trạng thái đơn hàng
                            </h4>
                            <form onSubmit={handleUpdate} className="py-6 px-8 text-sm">
                                <div className="font-semibold text-gray-500 mb-4 space-y-2 max-w-md">
                                    <div className="text-red-500">Lưu ý: Sau khi cập nhật thì bạn sẽ không thể chọn những trạng thái ở trên ở lần cập nhật tiếp theo.</div>
                                    <div>Chọn một trong các trạng thái sau:</div>
                                    <div className="ml-8 space-y-1">
                                        {productStatus.slice(_.indexOf(productStatus, order.status) + 1, 4).map((status, i) => (
                                            <div key={status}>
                                                <input defaultChecked={i === 0} type="radio" id={status} name="status" value={status} className="align-middle mr-1" />
                                                <label htmlFor={status} className="align-middle">{status}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right space-x-4">
                                    <button
                                        type='button'
                                        onClick={() => setUpdate('')}
                                        className="p-2 w-20 bg-gray-200 rounded-md text-gray-500 font-semibold"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        disabled={updateLoading}
                                        className="p-2 rounded-md text-blue-500 hover:text-blue-700 font-semibold"
                                    >
                                        Cập nhật
                                </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </BetterReactModal>
        </div>
    )
}

export default OrderModal