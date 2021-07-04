import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEdit } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { store } from 'react-notifications-component'
import * as yup from "yup"
import CheckoutEmpty from '../../components/Checkout/CheckoutEmpty'
import { GuestAddressForm, GuestInformationForm } from '../../components/Checkout/CheckoutForms'
import { productStatus } from '../../constants/product'
import { useCart } from '../../contexts/cart'
import Layout from '../../layouts/Layout'
import { useAuth } from '../../lib/auth'
import firebase from '../../lib/firebase'
import numberWithCommas from '../../utils/numberWithCommas'
import { calcListItemPrice, calcSingleItemPrice } from '../../utils/priceCalc'
import Button from '../../components/common/Button'

const SectionContainer = ({ children }) => {
    return (
        <div className="bg-gray-100 py-3 px-4 mb-4">
            {children}
        </div>
    )
}

const SectionHeading = ({ children }) => {
    return (
        <h3 className="font-semibold text-lg mb-3">
            {children}
        </h3>
    )
}

const schema = yup.object().shape({
    phone: yup.string().required().matches(/^[0-9]+$/).min(10).max(10),
    name: yup.string().required(),
    city: yup.string().required(),
    district: yup.string().required(),
    ward: yup.string().required(),
    street: yup.string().required()
})

const CheckoutSuccessPage = () => {
    return (
        <div>

        </div>
    )
}

export default function Checkout() {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const { items, increase, decrease, remove, clear } = useCart()
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    })
    const cartPrice = calcListItemPrice(items)
    const { authUser: auth } = useAuth()

    useEffect(() => {
        if (auth) {
            const { role, ...userInfo } = auth
            reset({
                ...userInfo,
                note: ''
            })
        }
    }, [auth])

    const onSubmit = async (data) => {
        console.log(data)
        if (loading)
            return
        setLoading(true)
        try {
            let fullData = {
                ...data,
                items,
                status: productStatus[0],
                totalPrice: cartPrice,
                history: [{
                    created_at: Date.now(),
                    status: "Đặt hàng thành công"
                }]
            }
            const order = await firebase.firestore().collection('orders').add(fullData)
            store.addNotification({
                title: "Thành công",
                message: "Đặt hàng thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
            router.push({
                pathname: 'kiem-tra-don-hang',
                query: { id: order.id, },
            }).then(() => { clear() })
        }
        catch (err) {
            store.addNotification({
                title: "Thất bại",
                message: "Đặt hàng thất bại\n" + err?.message || err,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
        setLoading(false)
    }

    return (
        success ? <CheckoutSuccessPage />
            :
            <Layout>
                <h1 className="font-bold text-2xl mb-4">Giỏ hàng của bạn</h1>
                {items.length === 0 ? <CheckoutEmpty />
                    : <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-8">
                        <div className="flex-1">
                            {auth ? (
                                <SectionContainer>
                                    <SectionHeading>
                                        Thông tin tài khoản{' '}
                                        {auth?.phone &&
                                            <Link href='/user'>
                                                <a className="text-xs">
                                                    <AiOutlineEdit className="inline-block mr-1 ml-4" />Chỉnh sửa
                                                </a>
                                            </Link>
                                        }
                                    </SectionHeading>
                                    {auth?.phone ? (
                                        <div className="text-sm space-y-2">
                                            <div className="flex">
                                                <div className="w-36 font-semibold">Họ tên:</div>
                                                <div>{auth?.name}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="w-36 font-semibold">Số điện thoại:</div>
                                                <div>{auth?.phone}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="w-36 font-semibold">Địa chỉ:</div>
                                                <div>{auth?.street}, {auth?.ward}, {auth?.district}, {auth.city}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-40 flex-center">
                                            <h2 className="text-2xl font-semibold mb-4">Bạn chưa cập nhật thông tin tài khoản</h2>
                                            <Link href="/user">
                                                <a style={{ maxWidth: 120 }} className="btn dark">
                                                    Cập nhật
                                                </a>
                                            </Link>
                                        </div>
                                    )}
                                </SectionContainer>
                            ) : (
                                <>
                                    <GuestInformationForm register={register} errors={errors} />
                                    <GuestAddressForm register={register} errors={errors} />
                                </>
                            )}
                            {/* Thanh toan */}
                            <SectionContainer>
                                <SectionHeading>
                                    Thông tin thanh toán
                                </SectionHeading>
                                <div className="text-sm font-medium mb-2">
                                    Phương thức thanh toán
                                </div>
                                <div className="flex space-x-4 text-sm font-medium">
                                    <div className="cursor-pointer h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all border-black">
                                        <div><FaRegMoneyBillAlt size={36} /></div>
                                        <div>Tiền mặt</div>
                                    </div>
                                </div>
                            </SectionContainer>
                            {/* Ghi chu */}
                            <SectionContainer>
                                <SectionHeading>
                                    Ghi chú
                                </SectionHeading>
                                <textarea
                                    {...register('note')}
                                    rows={4} className="w-full resize-none p-3 text-gray-700" />
                            </SectionContainer>
                        </div>
                        <div className="w-4/12 sticky top-16 self-start">
                            {/* San pham */}
                            <SectionContainer>
                                <SectionHeading>
                                    Sản phẩm
                                </SectionHeading>
                                {items.map(item => {
                                    return (
                                        <div className="py-4 flex text-sm font-bold">
                                            <div className="w-16 h-16">
                                                <img className="object-contain max-w-full max-h-full"
                                                    src={item.product.images[0]} />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between p-2">
                                                <div>
                                                    {item.product.name}
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <button type="button" onClick={() => decrease(item.product)} className="font-bold text-lg">-</button>
                                                    <span>{' '}{item.quantity}{' '}</span>
                                                    <button type="button" onClick={() => increase(item.product)} className="font-bold text-lg">+</button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between py-2 ml-1">
                                                <div className="">{numberWithCommas(calcSingleItemPrice(item.product) * item.quantity)}đ</div>
                                                <button type="button" className="text-right font-semibold" onClick={() => remove(item.product.id)}>Xóa</button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="flex items-center">
                                    <h4 className="text-right pr-3 flex-1 text-2xl">
                                        Tổng tiền:
                                    </h4>
                                    <div className="text-base font-medium">
                                        {numberWithCommas(cartPrice)}đ
                                    </div>
                                </div>
                            </SectionContainer>
                            {
                                !auth || auth.phone ? (
                                    <Button loading={loading}>
                                        Thanh toán
                                    </Button>
                                ) : (
                                    <button type="button" className="btn cursor-not-allowed">
                                        Cập nhật thông tin để thanh toán
                                    </button>
                                )}
                        </div>
                    </form>
                }
            </Layout>
    )
}