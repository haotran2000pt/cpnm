import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import BetterReactModal from "../../components/common/BetterReactModal";
import LoadingIcon from "../../components/common/LoadingIcon";
import AdminLayout from "../../layouts/AdminLayout";
import numberWithCommas from "../../utils/numberWithCommas";
import removeAccents from "../../utils/removeAccents";

const searchTwoString = (text, search) => removeAccents(text).toLowerCase().includes(removeAccents(search).toLowerCase())

export default function Users() {
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(null)
    const [search, setSearch] = useState('')
    const [deleteUser, setDeleteUser] = useState(null)
    const [deleteUserLoading, setDeleteUserLoading] = useState(false)
    const filtered = users.filter(ele => {
        return searchTwoString(ele.name, search) ||
            ele.phone.includes(search) ||
            ele.email.includes(search)
    })

    const onSearch = e => {
        e.preventDefault()
        setSearch(e.target.search.value)
    }

    const onDelete = async (e) => {
        e.preventDefault()
        setDeleteUserLoading(true)
        try {
            await axios.delete(`/api/users/${deleteUser.uid}`)
            setDeleteUserLoading(null)
            setDeleteUser(null)
            fetch()
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
        setDeleteUserLoading(false)
    }

    const fetch = async () => {
        setUsersLoading(true)
        const users = await axios.get('/api/users')
        setUsers(users.data)
        setUsersLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])

    return (
        <AdminLayout>
            <div className="mb-4">
                <h3 className="text-xl font-bold">Danh sách người dùng</h3>
            </div>
            <div className="bg-white rounded-lg p-3 border border-admin-darken">
                <form onSubmit={onSearch}
                    className="flex-auto bg-admin-100 rounded-lg flex max-w-lg mb-8">
                    <button className="font-medium p-2 w-10 text-center">
                        <AiOutlineSearch size={20} className="inline-block" />
                    </button>
                    <input
                        name="search"
                        className="w-64 pl-0 p-2 bg-transparent flex-auto text-sm font-semibold"
                        placeholder="Tìm kiếm theo tên khách hàng, số điện thoại, email" />
                </form>
                {usersLoading ? (<div className="h-24 flex-center"><LoadingIcon /></div>)
                    :
                    <div className="mx-2">
                        <table className="w-full">
                            <thead className="text-left text-gray-500 text-sm">
                                <tr>
                                    <th>Tên khách hàng</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Số đơn đã giao</th>
                                    <th>Tổng chi tiêu</th>
                                    <th>Ngày đăng ký</th>
                                    <th>Lần đăng nhập cuối</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(row => (
                                    <tr
                                        className="text-sm hover:bg-gray-100">
                                        <td className="py-2 pl-2">{row.name}</td>
                                        <td>{row.phone}</td>
                                        <td>{row.email}</td>
                                        <td>{numberWithCommas(row.orders)}</td>
                                        <td>{numberWithCommas(row.total_spend)}</td>
                                        <td>{row.create_date}</td>
                                        <td>{row.last_sign}</td>
                                        <td className="py-2">
                                            <button onClick={() => setDeleteUser({
                                                uid: row.uid,
                                                email: row.email
                                            })}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl">
                                                Xóa
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <BetterReactModal
                isOpen={deleteUser}
                onClose={() => setDeleteUser(null)}
                preventClose={deleteUserLoading}
            >
                <div className="bg-white">
                    {deleteUserLoading &&
                        <div className="absolute inset-0 flex-center bg-dark bg-opacity-20">
                            <LoadingIcon />
                        </div>
                    }
                    <h4 className="font-bold mb-1 bg-red-100 text-red-700 py-4 px-8">
                        <GoAlert className="inline-block mr-1" /> <span className="align-middle">Xác nhận xóa tài khoản</span>
                    </h4>
                    <div className="py-6 px-8 text-sm">
                        <div className="font-semibold text-gray-500 mb-4">Tài khoản sẽ bị xóa vĩnh viễn và không thể hoàn tác.</div>
                        <div className="text-xs font-bold text-gray-500">
                            Tài khoản
                        </div>
                        <div className="text-base font-medium">
                            {deleteUser?.email}
                        </div>
                        <div className="text-right space-x-4">
                            <button
                                onClick={() => setDeleteUser(null)}
                                className="font-semibold text-gray-500"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={onDelete}
                                disabled={deleteUserLoading}
                                className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold"
                            >
                                Xóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            </BetterReactModal>
        </AdminLayout>
    )
}