import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCreditCard, AiOutlineEdit } from 'react-icons/ai'
import { RiHandCoinLine } from 'react-icons/ri'
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
import { LoadingPage } from '../../components/common/LoadingPage'
import classNames from 'classnames'
import { FaPaypal } from 'react-icons/fa'
import { createVnPayUrl } from '../../utils/vnPay'

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

export const PaymentMethod = {
    COD: 'cod',
    PAYPAL: 'paypal',
    BANK: 'bank'
}

const CheckoutSuccessPage = () => {
    return (
        <div>

        </div>
    )
}

export async function getServerSideProps({ req }) {
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    return {
        props: { ip }
    }
}

export default function Checkout({ ip }) {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [payment, setPayment] = useState(PaymentMethod.COD)
    const { items, increase, decrease, remove, clear, isLoading } = useCart()
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const cartPrice = isLoading ? 0 : calcListItemPrice(items)
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
        if (items.length === 0 || isLoading) {
            return
        }
        if (loading)
            return
        setLoading(true)
        try {
            const currentMillis = Date.now()
            let fullData = {
                ...data,
                items: items.map(item => ({ id: item.id, quantity: item.quantity })),
                status: productStatus[0],
                totalPrice: cartPrice,
                history: [{
                    created_at: currentMillis,
                    status: "Đặt hàng thành công"
                }],
                created_at: currentMillis
            }
            const newOrderRef = firebase.firestore().collection('orders').doc()

            const orderId = newOrderRef.id

            switch (payment) {
                case PaymentMethod.COD:
                    await newOrderRef.set({
                        ...fullData,
                        payment
                    })
                    store.addNotification({
                        title: "Thành công",
                        message: "Đặt hàng thành công",
                        type: "success",
                        insert: "top",
                        container: "bottom-right",
                    })
                    break;
                case PaymentMethod.BANK:
                    await newOrderRef.set({
                        ...fullData,
                        payment,
                        paymentInfo: {
                            status: "pending"
                        }
                    })
                    const url = createVnPayUrl({
                        amount: cartPrice,
                        ip,
                        orderId
                    })
                    window.location.href = url
                    break;
            }
        }
        catch (err) {
            store.addNotification({
                title: "Thất bại",
                message: "Đặt hàng thất bại\n" + err?.message || err,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
            setLoading(false)
        }
    }

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };

    return (
        success ? <CheckoutSuccessPage />
            :
            <Layout>
                <h1 className="font-bold text-2xl mb-4">Giỏ hàng của bạn</h1>
                <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} className="flex space-x-8">
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
                                <button
                                    type="button"
                                    onClick={() => setPayment(PaymentMethod.COD)}
                                    className={classNames("h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all duration-100", {
                                        "border-black": payment === PaymentMethod.COD,
                                        "border-white hover:border-gray-200": payment !== PaymentMethod.COD
                                    })}>
                                    <div><RiHandCoinLine size={36} /></div>
                                    <div className="font-semibold">Tiền mặt</div>
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={() => setPayment(PaymentMethod.PAYPAL)}
                                    className={classNames("h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all duration-100", {
                                        "border-black": payment === PaymentMethod.PAYPAL,
                                        "border-white hover:border-gray-200": payment !== PaymentMethod.PAYPAL
                                    })}>
                                    <div><FaPaypal size={36} /></div>
                                    <div className="font-semibold">Paypal</div>
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => setPayment(PaymentMethod.BANK)}
                                    className={classNames("h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all duration-100", {
                                        "border-black": payment === PaymentMethod.BANK,
                                        "border-white hover:border-gray-200": payment !== PaymentMethod.BANK
                                    })}>
                                    <div><AiFillCreditCard size={36} /></div>
                                    <div className="font-semibold">Ngân hàng</div>
                                </button>
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
                            {isLoading ? <div className="flex-center relative h-[250px]"><LoadingPage /></div>
                                : items.length === 0 ? <div className="h-[250px] flex-center"><CheckoutEmpty /></div>
                                    :
                                    <>
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
                                    </>
                            }
                        </SectionContainer>
                        {
                            !auth || auth.phone ? (
                                <Button
                                    disable={isLoading || items.length === 0}
                                    loading={loading}>
                                    Thanh toán
                                </Button>
                            ) : (
                                <button type="button" className="btn cursor-not-allowed">
                                    Cập nhật thông tin để thanh toán
                                </button>
                            )}
                    </div>
                </form>
            </Layout>
    )
}