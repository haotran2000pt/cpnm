import Link from "next/link";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { categories } from "../../../constants/category";
import AdminLayout from "../../../layouts/AdminLayout";
import numberWithCommas from '../../../utils/numberWithCommas'
import removeAccents from '../../../utils/removeAccents'
import * as yup from 'yup'
import useProducts from '../../../lib/query/useProducts'

export const productSchema = yup.object().shape({
    price: yup.number().min(1000).required(),
    name: yup.string().required().min(5),
    description: yup.string().required().min(50),
    quantity: yup.number().min(0).required(),
    slug: yup.string().required().min(5),
    manufacturer: yup.string().required("Hãng sản xuất không được để trống"),
    modelSeries: yup.string().required("Dòng sản phẩm không được để trống"),
    discount: yup.number().required().min(0),
    specifications: yup.array().of(
        yup.object().shape({
            name: yup.string().required(),
            specs: yup.array().min(1).of(
                yup.object().shape({
                    title: yup.string().required(),
                    detail: yup.string().required()
                })
            )
        })
    ).min(1, "Vui lòng có ít nhất 1 thông số!")
})

export default function Products() {
    const { isLoading, data } = useProducts({
        order: [{
            field: "created_at",
            direct: "desc"
        }]
    })
    const [search, setSearch] = useState('')
    const filtered = isLoading ? [] : data.filter(ele =>
        removeAccents(ele.name.toLowerCase()).includes(removeAccents(search.toLowerCase())) ||
        ele.id.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminLayout>
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">Danh sách sản phẩm</h3>
                <Link href='/admin/products/create'>
                    <a className="p-2 bg-blue-600 text-sm font-semibold shadow rounded-md hover:bg-blue-700 text-white transition-colors">
                        <AiOutlinePlus className="inline-block" /> <span className='align-middle'>Thêm sản phẩm</span>
                    </a>
                </Link>
            </div>
            <div className="bg-white rounded-lg p-3 border border-admin-darken">
                <form onSubmit={e => { e.preventDefault(); setSearch(e.target.search.value) }}
                    className="bg-admin-100 rounded-lg flex max-w-sm mb-4">
                    <button className="font-medium p-2 w-10 text-center">
                        <AiOutlineSearch size={20} className="inline-block" />
                    </button>
                    <input
                        name="search"
                        className="w-64 pl-0 p-2 bg-transparent flex-auto text-sm font-semibold"
                        placeholder="Tìm kiếm theo SKU, tên sản phẩm" />
                </form>
                <div className="mx-2">
                    <table className="w-full">
                        <thead className="text-left text-gray-500 text-sm">
                            <tr>
                                <th className="py-2 pl-2">SKU</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Danh mục</th>
                                <th>Khuyến mãi</th>
                                <th>Số lượng đã bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading &&
                                filtered.map(row => (
                                    <Link key={row.id} href={"/admin/products/" + row.slug}>
                                        <tr className="text-sm hover:bg-gray-100 cursor-pointer">
                                            <td className="py-2 pl-2">{row.id}</td>
                                            <td>{row.name}</td>
                                            <td>{numberWithCommas(row.price)}đ</td>
                                            <td>{categories[row.category].name}</td>
                                            <td>{numberWithCommas(row.discount)}đ</td>
                                            <td>{row.soldUnits}</td>
                                        </tr>
                                    </Link>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}