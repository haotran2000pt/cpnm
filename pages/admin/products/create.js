import { yupResolver } from '@hookform/resolvers/yup';
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import { store } from 'react-notifications-component';
import { v4 } from "uuid";
import { productSchema } from ".";
import CreateProduct from "../../../components/Admin/CreateProduct";
import AdminLayout from "../../../layouts/AdminLayout";
import firebase from '../../../lib/firebase';

export default function ProductCreate() {
    const [images, setImages] = useState([])
    const router = useRouter()

    const methods = useForm({
        resolver: yupResolver(productSchema)
    })

    const loading = methods.formState.isSubmitting

    const onSubmit = async (data) => {
        if (data.price < data.discount) {
            methods.setError('price', {
                type: "other",
                message: "Giá không thể thấp hơn khuyến mãi"
            })
            return;
        }
        if (loading)
            return
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
            <FormProvider {...methods}>
                <CreateProduct
                    onSubmit={methods.handleSubmit(onSubmit)}
                    loading={loading}
                    images={images}
                    setImages={setImages}
                />
            </FormProvider>
        </AdminLayout>
    )
}