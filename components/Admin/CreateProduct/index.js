import classNames from "classnames";
import LoadingIcon from "../../common/LoadingIcon";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import SpecificationInfo from "./SpecificationInfo";
import Scroll from 'react-scroll'
import Link from "next/link";
import { useMutation } from "react-query";
import firebase from '../../../lib/firebase'
import axios from "axios";
import { useRouter } from "next/router";
import { store } from 'react-notifications-component'
import { useAuth } from "../../../lib/auth";
import { UserRole } from "../../../constants/user";

export default function CreateProduct({ loading, images, setImages, onSubmit, product }) {
    const router = useRouter()
    const { authUser } = useAuth()

    const cloneMutate = useMutation(async (data) => {
        try {
            await firebase.firestore().collection('products').add({
                ...data,
                name: data.name + " (bản sao)"
            })
            store.addNotification({
                title: "Thành công",
                message: "Tạo bản sao thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        } catch (e) {
            store.addNotification({
                title: "Thất bại",
                message: "Tạo bản sao thất bại " + e?.message ?? e,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
    })

    const deleteMutate = useMutation(async (pid) => {
        try {
            await axios.delete(`/api/products/${pid}`)
            store.addNotification({
                title: "Thành công",
                message: "Xóa sản phẩm thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
            router.push('/admin/products')
        } catch (e) {
            store.addNotification({
                title: "Thất bại",
                message: "Xóa sản phẩm thất bại " + e?.message ?? e,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }

    })

    const onClone = () => {
        if (cloneMutate.isLoading) {
            return
        }
        const { id, ...data } = product
        cloneMutate.mutate(data)
    }

    const onDelete = () => {
        if (deleteMutate.isLoading) {
            return
        }
        const { id, ...data } = product
        deleteMutate.mutate(id)
    }

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };

    return (
        <form onSubmit={onSubmit}>
            <fieldset disabled={authUser.role === UserRole.MODERATOR} className="flex space-x-8">
                <div className="flex-1">
                    <Scroll.Element name="basic">
                        <BasicInfo images={images} setImages={setImages} />
                    </Scroll.Element>
                    <Scroll.Element name="sales">
                        <SalesInfo />
                    </Scroll.Element>
                    <Scroll.Element name="spec">
                        <SpecificationInfo defaultValues={product?.specifications} />
                    </Scroll.Element>
                </div>
                <div className="w-60 self-start sticky top-10">
                    <ul className="font-semibold text-sm space-y-2">
                        <li>
                            <Scroll.Link
                                offset={-80}
                                className="cursor-pointer"
                                activeClass="text-blue-700" to="basic"
                                spy={true} smooth={true} duration={400}
                            >
                                Thông tin cơ bản
                            </Scroll.Link>
                        </li>
                        <li>
                            <Scroll.Link
                                offset={-80}
                                className="cursor-pointer"
                                activeClass="text-blue-700" to="sales"
                                spy={true} smooth={true} duration={400}
                            >
                                Thông tin bán hàng
                            </Scroll.Link>
                        </li>
                        <li>
                            <Scroll.Link
                                offset={-80}
                                className="cursor-pointer"
                                activeClass="text-blue-700" to="spec"
                                spy={true} smooth={true} duration={400}
                            >
                                Thông số kỹ thuật
                            </Scroll.Link>
                        </li>
                    </ul>
                    {authUser.role !== UserRole.MODERATOR &&
                        <div>
                            {product &&
                                <Link href={`/san-pham/${product.slug}`}>
                                    <a target="_blank" className="block mt-4 w-40 text-blue-800 font-semibold text-[15px]">
                                        Xem trang sản phẩm
                                    </a>
                                </Link>
                            }
                            <button disabled={loading}
                                className={classNames("py-3 px-5 mt-4 " +
                                    "text-white transition-colors font-semibold rounded-lg text-sm shadow w-40", {
                                    'bg-gray-400 cursor-not-allowed': loading,
                                    'bg-blue-500 hover:bg-blue-700': !loading
                                })}>
                                {loading ? <LoadingIcon /> : product ? "Cập nhật" : "Đăng sản phẩm"}
                            </button>
                            {product &&
                                <>
                                    <button
                                        type="button"
                                        onClick={onClone}
                                        className={classNames("py-3 px-5 mt-4 " +
                                            "text-white transition-colors font-semibold rounded-lg text-sm shadow w-40", {
                                            'bg-gray-400 cursor-not-allowed': cloneMutate.isLoading,
                                            'bg-green-500 hover:bg-green-600': !cloneMutate.isLoading
                                        })}>
                                        {cloneMutate.isLoading ? <LoadingIcon className="inline-block" /> : "Tạo bản sao"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onDelete}
                                        className={classNames("py-3 px-5 mt-4 " +
                                            "text-white transition-colors font-semibold rounded-lg text-sm shadow w-40", {
                                            'bg-gray-400 cursor-not-allowed': deleteMutate.isLoading,
                                            'bg-red-500 hover:bg-red-700': !deleteMutate.isLoading
                                        })}>
                                        {deleteMutate.isLoading ? <LoadingIcon className="inline-block" /> : "Xóa sản phẩm"}
                                    </button>
                                </>
                            }
                        </div>
                    }
                </div>
            </fieldset>
        </form>
    )
}
