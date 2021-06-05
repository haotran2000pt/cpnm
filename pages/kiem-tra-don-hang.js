import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import LoadingIcon from '../components/common/LoadingIcon'
import Layout from '../layouts/Layout'
import firebase from '../lib/firebase'
import _ from 'lodash'
import Button from '../components/common/Button'
import { useRouter } from 'next/router'
import Head from 'next/head'
import moment from 'moment'
import classNames from 'classnames'
import numberWithCommas from '../utils/numberWithCommas'
import { calcListItemPrice, calcSingleItemPrice } from '../utils/priceCalc'

const Header = () => (
    <div className="p-8 bg-dark text-white text-center text-xl font-semibold">
        Kiểm tra đơn hàng
    </div>
)

const Left = ({ children }) => (<div className="w-40 font-semibold">{children}</div>)

const Right = ({ children }) => (<div>{children}</div>)


export default function Search() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState(null)
    const [orderId, setOrderId] = useState('')

    const onSearch = async (id) => {
        router.push({
            query: {
                id
            }
        }, undefined, { shallow: true })

        if (_.isEmpty(id)) {
            alert('Mã đơn hàng không thể để trống')
            return
        }
        setOrder(null)
        setLoading(true)
        const order = await firebase.firestore().collection('orders').doc(id).get()
        if (order.exists) {
            console.log(id)
            setOrder({ ...order.data(), created_at: _.last(order.data().history).created_at, id: order.id })
        } else {
            setOrder({})
        }
        setLoading(false)
    }

    useEffect(() => {
        if (router.isReady && router.query.id) {
            onSearch(router.query.id)
        }
    }, [router.isReady])

    return (
        <Layout aboveComponent={<Header />}>
            <Head>
                <title>Kiểm tra đơn hàng</title>
            </Head>
            <div className="my-20">
                <div className="flex space-x-3 border border-dark p-3 items-center relative">
                    <div className="font-semibold">
                        Mã đơn hàng (VD: GF4E1V38HeBCpss4Z4F5)
                        {loading && (
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex-center">
                                <LoadingIcon />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            value={orderId} onChange={e => setOrderId(e.target.value)}
                            className="w-full h-full bg-gray-200 p-2" />
                    </div>
                    <div>
                        <Button onClick={() => onSearch(orderId)}>
                            <AiOutlineSearch />
                        </Button>
                    </div>
                </div>
                {_.isNull(order)
                    ? null
                    : _.isEmpty(order) ? (
                        <div className="mt-2 p-4 bg-gray-100">
                            Không tìm thấy kết quả nào!
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2 pb-2">Đơn hàng # {order.id}</h2>
                            <div className="flex border-t mb-2">
                                <div className="pt-2 space-y-2 flex-1">
                                    <div className="flex">
                                        <Left>Họ tên:</Left>
                                        <Right>************* {order.name.split(' ').pop()}</Right>
                                    </div>
                                    <div className="flex">
                                        <Left>Số điện thoại:</Left>
                                        <Right>*******{order.phone.slice(7, 10)}</Right>
                                    </div>
                                    <div className="flex">
                                        <Left>Địa chỉ:</Left>
                                        <Right>****, {order.district}, {order.city}</Right>
                                    </div>
                                    <div className="flex">
                                        <Left>Trạng thái:</Left>
                                        <Right>{order.status}</Right>
                                    </div>
                                    <div className="flex">
                                        <Left>Ngày đặt:</Left>
                                        <Right>{moment(order.created_at).format('DD-MM-YYYY')}</Right>
                                    </div>
                                    {order.status === 'Đã giao' &&
                                        <div className="flex">
                                            <Left>Ngày giao:</Left>
                                            <Right>{moment(order.history[0].created_at).format('DD-MM-YYYY')}</Right>
                                        </div>
                                    }
                                </div>
                                <div className="w-px bg-gray-100 mx-4" />
                                <div className="pt-2 flex-1">
                                    <Left>Lịch sử đơn hàng:</Left>
                                    <div className="relative">
                                        {order.history.map((history, index) => (
                                            <div className="flex items-center z-10 relative">
                                                <div className={classNames('w-2 h-2 rounded-full mr-2', {
                                                    'bg-dark': index === 0,
                                                    'bg-gray-200': index !== 0
                                                })} />
                                                <div className="w-40 font-semibold">{moment(history.created_at).format('HH:mm DD-MM-YYYY')}</div>
                                                <div className="">{history.status}</div>
                                            </div>
                                        ))}
                                        <div className="absolute h-full w-2 flex justify-center py-3 z-0 top-0">
                                            <div className="h-full w-px bg-gray-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-gray-100 max-w-xl mt-2">
                                <table className="w-full">
                                    <tr>
                                        <th className="pb-2 text-left">Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th className="text-right">Đơn giá</th>
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
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-right">{numberWithCommas(calcSingleItemPrice(item.product) * item.quantity)}đ</td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold text-xl">
                                            <td />
                                            <td className="py-4 text-right">
                                                TỔNG:
                                            </td>
                                            <td className="text-right">
                                                {numberWithCommas(calcListItemPrice(order.items))}đ
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
            </div>
        </Layout>
    )
}