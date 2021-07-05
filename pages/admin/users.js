import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import { BiDotsVerticalRounded, BiTrash } from "react-icons/bi";
import BetterReactModal from "../../components/common/BetterReactModal";
import LoadingIcon from "../../components/common/LoadingIcon";
import AdminLayout from "../../layouts/AdminLayout";
import numberWithCommas from "../../utils/numberWithCommas";
import removeAccents from "../../utils/removeAccents";
import useUsers from '../../lib/query/useUsers'
import { Menu, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from "react-query";
import firebase from '../../lib/firebase'
import { UserRole } from "../../constants/user";
import { useAuth } from "../../lib/auth";

const searchTwoString = (text, search) => removeAccents(text).toLowerCase().includes(removeAccents(search).toLowerCase())

const DeleteModal = ({ deleteUser, setDeleteUser }) => {
    const [deleteUserLoading, setDeleteUserLoading] = useState(false)
    const queryClient = useQueryClient()
    const { refetch } = useUsers()

    const onDelete = async (e) => {
        e.preventDefault()
        setDeleteUserLoading(true)
        try {
            await axios.delete(`/api/users/${deleteUser.uid}`)
            setDeleteUserLoading(null)
            setDeleteUser(null)
            queryClient.invalidateQueries('users')
            refetch()
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
        setDeleteUserLoading(false)
    }

    return (
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
    )
}

const UpdateModal = ({ openUpdateRole, setOpenUpdateRole, user }) => {
    const queryClient = useQueryClient()
    const [role, setRole] = useState(user.role)
    const { refetch } = useUsers()
    const { mutate, isLoading } = useMutation(async (data) => {
        await firebase.firestore().collection('users').doc(user.uid).update({
            "role": data
        })
    }, {
        onSuccess: () => {
            setOpenUpdateRole(false)
            queryClient.invalidateQueries('users')
            refetch()
        }
    })

    return (
        <BetterReactModal
            isOpen={openUpdateRole}
            onClose={() => setOpenUpdateRole(false)}
            preventClose={isLoading}
        >
            <div className="bg-white min-w-[400px]">
                {isLoading &&
                    <div className="absolute inset-0 flex-center bg-dark bg-opacity-20">
                        <LoadingIcon />
                    </div>
                }
                <h4 className="font-bold mb-1 bg-blue-500 text-white py-4 px-8">
                    <GoAlert className="inline-block mr-1" /> <span className="align-middle">Cập nhật vai trò tài khoản</span>
                </h4>
                <div className="py-6 px-8 text-sm">
                    <div className="text-xs font-bold text-gray-500">
                        Tài khoản
                    </div>
                    <div className="text-[15px] font-bold mb-2 text-gray-700">
                        <div>UID: <span className="text-[13px] font-semibold">{user?.uid}</span></div>
                        <div>Email: <span className="text-[13px] font-semibold">{user?.email}</span></div>
                        <div>Tên: <span className="text-[13px] font-semibold">{user?.name}</span></div>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-500">Chọn một trong các vai trò sau:</div>
                        <div className="ml-8">
                            {Object.keys(UserRole).map(key => {
                                if (UserRole[key] === UserRole.SUPER_ADMIN) {
                                    return null
                                }
                                return (
                                    <div key={key} className="flex items-center">
                                        <input
                                            id={key}
                                            type="radio"
                                            name="role"
                                            value={UserRole[key]}
                                            onChange={e => setRole(e.target.value)}
                                            defaultChecked={UserRole[key] === user.role}
                                        /> <label htmlFor={key} className="ml-2 font-semibold">{key}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="text-right space-x-4">
                        <button
                            onClick={() => setOpenUpdateRole(false)}
                            className="font-semibold text-gray-500"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => mutate(role)}
                            disabled={isLoading}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </BetterReactModal>
    )
}


export default function Users() {
    const { data: users, isLoading: usersLoading } = useUsers()
    const [search, setSearch] = useState('')
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [selectedUser, setSelectedUser] = useState(false)
    const [deleteUser, setDeleteUser] = useState(null)
    const { authUser } = useAuth()
    const filtered = !users ? [] : users.filter(ele => {
        return searchTwoString(ele.name, search) ||
            ele.phone.includes(search) ||
            ele.email.includes(search)
    })

    const onSearch = e => {
        e.preventDefault()
        setSearch(e.target.search.value)
    }

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
                                    <th>Vai trò</th>
                                    <th>Số đơn đã giao</th>
                                    <th>Tổng chi tiêu</th>
                                    <th>Ngày đăng ký</th>
                                    <th>Lần đăng nhập cuối</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(row => (
                                    <tr className="text-sm hover:bg-gray-100">
                                        <td className="py-2 pl-2">{row.name}</td>
                                        <td>{row.phone}</td>
                                        <td>{row.email}</td>
                                        <td className="pr-2">
                                            <span className="bg-blue-500 text-white text-center font-semibold p-1 rounded-md w-full inline-block">{row.role}</span>
                                        </td>
                                        <td>{numberWithCommas(row.orders)}</td>
                                        <td>{numberWithCommas(row.total_spend)}</td>
                                        <td>{row.create_date}</td>
                                        <td>{row.last_sign}</td>
                                        <td className="py-2">
                                            {authUser.role !== UserRole.MODERATOR &&
                                                <div className="z-10">
                                                    <Menu as="div">
                                                        <div>
                                                            <Menu.Button className="z-0 w-6 h-6 flex-center">
                                                                <BiDotsVerticalRounded size={22} />
                                                            </Menu.Button>
                                                        </div>
                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-100"
                                                            enterFrom="transform opacity-0 scale-95"
                                                            enterTo="transform opacity-100 scale-100"
                                                            leave="transition ease-in duration-75"
                                                            leaveFrom="transform opacity-100 scale-100"
                                                            leaveTo="transform opacity-0 scale-95"
                                                        >
                                                            <div className="relative">
                                                                <Menu.Items className="absolute z-20 w-32 py-2 right-0 -top-2 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => {
                                                                                setSelectedUser(row)
                                                                                setOpenUpdateRole(true)
                                                                            }}
                                                                                className="p-2 hover:bg-gray-100 text-left w-full font-medium block">
                                                                                Cập nhật vai trò
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => setDeleteUser({
                                                                                uid: row.uid,
                                                                                email: row.email
                                                                            })}
                                                                                className="text-red-500 p-2 hover:bg-gray-100 text-left w-full font-medium block">
                                                                                Xóa tài khoản
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </Menu.Items>
                                                            </div>
                                                        </Transition>
                                                    </Menu>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <DeleteModal
                deleteUser={deleteUser}
                setDeleteUser={setDeleteUser}
            />
            <UpdateModal
                openUpdateRole={openUpdateRole}
                setOpenUpdateRole={setOpenUpdateRole}
                user={selectedUser}
            />
        </AdminLayout >
    )
}