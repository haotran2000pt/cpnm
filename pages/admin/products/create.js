import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import AdminLayout from "../../../layouts/AdminLayout";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import firebase from '../../../lib/firebase'
import { store } from 'react-notifications-component';
import { useRouter } from "next/router";
import CreateProduct from "../../../components/Admin/CreateProduct";
import { v4 } from "uuid";

const schema = yup.object().shape({
    price: yup.number().min(1000).required(),
    name: yup.string().required().min(5),
    description: yup.string().required().min(50).max(2000),
    // quantity: yup.number().min(0).required(),
    slug: yup.string().required().min(5),
    discount: yup.number().required().min(0)
})

export default function ProductCreate() {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const router = useRouter()

    const { control, handleSubmit, ...form } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        if (loading)
            return
        setLoading(true)
        const imageURLs = await Promise.all(
            images.map(async (image) => {
                if (typeof image === 'string')
                    return image
                const imageRef = firebase.storage().ref().child(v4())
                const snapshot = await imageRef.put(image)
                return await snapshot.ref.getDownloadURL()
            })
        )
        await firebase.firestore().collection('products').add({
            ...data,
            images: imageURLs,
            soldUnits: 0,
            avgRating: 0,
            ratingCount: 0,
            created_at: Date.now()
        })
        store.addNotification({
            title: "Thành công",
            message: "Sản phẩm đã được thêm thành công",
            type: "success",
            insert: "top",
            container: "bottom-right",
        })
        router.push(`/admin/products/${data.slug}`)
    }

    return (
        <AdminLayout>
            <Link href='/admin/products'>
                <a className="text-sm font-semibold mb-2 block -ml-1">
                    <FiChevronLeft className="inline-block" size={18} /> <span className="align-middle">Trở lại</span>
                </a>
            </Link>
            <h3 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h3>
            <CreateProduct
                onSubmit={handleSubmit(onSubmit)}
                form={form}
                control={control}
                loading={loading}
                images={images}
                setImages={setImages}
            />
        </AdminLayout>
    )
}