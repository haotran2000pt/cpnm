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
import { getProduct } from "../../../lib/db";

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

const schema = yup.object().shape({
    price: yup.number().min(1000).required(),
    name: yup.string().required().min(5),
    description: yup.string().required().min(50).max(2000),
    quantity: yup.number().min(0).required(),
    slug: yup.string().required().min(5),
    discount: yup.number().required().min(0)
})

export default function ProductDetail({ product }) {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState(product.images)
    const router = useRouter()

    const { control, handleSubmit, reset, ...form } = useForm({
        resolver: yupResolver(schema),
        defaultValues: product
    })

    const onSubmit = async (data) => {
        if (loading)
            return
        setLoading(true)
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
            await firebase.firestore().collection('products').doc(product.id).set({
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
            <CreateProduct
                onSubmit={handleSubmit(onSubmit)}
                form={form}
                control={control}
                product={product}
                loading={loading}
                images={images}
                setImages={setImages}
            />
        </AdminLayout>
    )
}