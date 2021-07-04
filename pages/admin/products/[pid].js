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
import { getProduct } from "../../../lib/db";
import firebase from '../../../lib/firebase';

export async function getServerSideProps({ params }) {
    const product = await getProduct(params.pid)

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            },
        }
    }

    return {
        props: {
            product
        },
    }
}

export default function ProductDetail({ product }) {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState(product.images)
    const router = useRouter()

    const methods = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: product
    })

    const onSubmit = async (value) => {
        if (value.price < value.discount) {
            methods.setError('price', {
                type: "other",
                message: "Giá không thể thấp hơn khuyến mãi"
            })
            return;
        }
        if (loading)
            return
        setLoading(true)
        const { id, ...data } = value
        try {
            const imageURLs = await Promise.all(
                images.map(async (image) => {
                    if (typeof image === 'string')
                        return image
                    const imageRef = firebase.storage().ref().child(v4())
                    const snapshot = await imageRef.put(image)
                    return await snapshot.ref.getDownloadURL()
                })
            )
            await firebase.firestore().collection('products').doc(id).set({
                ...data,
                images: imageURLs,
                created_at: Date.now()
            }, {
                merge: true
            })
            store.addNotification({
                title: "Thành công",
                message: "Sản phẩm đã được cập nhật thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
            router.push(`/admin/products/${data.slug}`)
        }
        catch (err) {
            store.addNotification({
                title: "Thất bại",
                message: "Không thể cập nhật sản phẩm\n" + err?.message || err,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
        setLoading(false)
    }

    return (
        <AdminLayout>
            <Link href='/admin/products'>
                <a className="text-sm font-semibold mb-2 block -ml-1">
                    <FiChevronLeft className="inline-block" size={18} /> <span className="align-middle">Trở lại</span>
                </a>
            </Link>
            <h1 className="text-xl font-bold mb-1">Cập nhật sản phẩm</h1>
            <h5 className="mb-4 text-lg font-medium">{product.name}</h5>
            <FormProvider {...methods}>
                <CreateProduct
                    onSubmit={methods.handleSubmit(onSubmit)}
                    product={product}
                    loading={loading}
                    images={images}
                    setImages={setImages}
                />
            </FormProvider>
        </AdminLayout>
    )
}