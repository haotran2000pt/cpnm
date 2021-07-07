import classNames from "classnames";
import moment from "moment";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import OrderModal from "../../components/Admin/Order/OrderModal";
import BetterReactModal from "../../components/common/BetterReactModal";
import useOrders from "../../lib/query/useOrders";
import AdminLayout from "../../layouts/AdminLayout";
import numberWithCommas from "../../utils/numberWithCommas";
import { calcListItemPrice } from "../../utils/priceCalc";
import removeAccents from "../../utils/removeAccents";

const searchTwoString = (text, search) => removeAccents(text).toLowerCase().includes(removeAccents(search).toLowerCase())

const searchStatuses = ['', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao', 'Đã hủy']

export default function Orders() {
    const { isFetching, data, refetch } = useOrders({
        order: [{ field: 'created_at', direct: 'desc' }]
    })
    const [search, setSearch] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [order, setOrder] = useState(null)
    const filtered = isFetching ? [] : data.filter(ele => {
        return (searchTwoString(ele.name, search) ||
            searchTwoString(ele.id, search) ||
            ele.phone.includes(search)) &&
            ele.status.includes(searchStatus)
    })
    filtered.sort((a, b) => b.created_at - a.created_at)

    const onSearch = e => {
        e.preventDefault()
        setSearch(e.target.search.value)
    }

    return (
        <AdminLayout>
            <div className="mb-4">
                <h3 className="text-xl font-bold">Danh sách đơn hàng</h3>
            </div>
            <div className="bg-white rounded-lg p-3 border border-admin-darken">
                <div className="flex items-center mb-4 space-x-4">
                    <form onSubmit={onSearch}
                        className="flex-auto bg-admin-100 rounded-lg flex max-w-sm">
                        <button className="font-medium p-2 w-10 text-center">
                            <AiOutlineSearch size={20} className="inline-block" />
                        </button>
                        <input
                            name="search"
                            className="w-64 pl-0 p-2 bg-transparent flex-auto text-sm font-semibold"
                            placeholder="Tìm kiếm theo ID, tên khách hàng, số điện thoại" />
                    </form>
                    <div className="flex text-sm space-x-4">
                        {searchStatuses.map(status => (
                            <button key={`${status}button`}
                                onClick={() => setSearchStatus(status)}
                                className={classNames("relative inline-block px-3 h-8 rounded-full font-semibold", {
                                    'bg-blue-500 text-white': searchStatus === status,
                                    'hover:bg-gray-100': searchStatus !== status
                                })}>
                                {status || "Tất cả"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mx-2">
                    <table className="w-full">
                        <thead className="text-left text-gray-500 text-sm">
                            <tr>
                                <th className="py-2 pl-2">Mã đơn hàng</th>
                                <th>Tên khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Thời gian đặt</th>
                                <th>Trạng thái</th>
                                <th>Tổng tiền</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isFetching &&
                                filtered.map(row => (
                                    <tr onClick={() => setOrder(row)}
                                        className="text-sm hover:bg-gray-100 cursor-pointer">
                                        <td className="py-2 pl-2">{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.phone}</td>
                                        <td>{moment(row.created_at).format('HH:mm DD/MM/YYYY')}</td>
                                        <td>{row.status}</td>
                                        <td>{numberWithCommas(calcListItemPrice(row.items))}đ</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <BetterReactModal
                isOpen={order}
                onClose={() => setOrder(null)}
                preventClose={true}
            >
                <OrderModal refetch={refetch} onClose={() => setOrder(null)} order={order} />
            </BetterReactModal>
        </AdminLayout>
    )
}