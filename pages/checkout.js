import Layout from '../layouts/Layout'
import { useState } from 'react'
import CheckoutEmpty from '../components/Checkout/CheckoutEmpty'
import Input from '../components/common/Input'
import { IoMdCash } from 'react-icons/io'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { AiOutlineBank, AiOutlineCreditCard } from 'react-icons/ai'
import Button from '../components/common/Button'

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

export default function Checkout() {
    const [state, setState] = useState(false)

    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Giỏ hàng của bạn <button onClick={() => setState(!state)}>Toggle</button></h1>
            {state ? <CheckoutEmpty />
                : <div className="flex space-x-8">
                    <div className="flex-1">
                        {/* San pham */}
                        <SectionContainer>
                            <SectionHeading>
                                Sản phẩm
                            </SectionHeading>
                            <div className="h-10 bg-white mb-3">
                            </div>
                            <div className="h-10 bg-white mb-3">
                            </div>
                        </SectionContainer>
                        {/* Thong tin ca nhan */}
                        <SectionContainer>
                            <SectionHeading>
                                Thông tin khách hàng
                            </SectionHeading>
                            <div className="flex space-x-5">
                                <div className="flex-1">
                                    <Input
                                        label="Số điện thoại"
                                        id="phone_number"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Tên"
                                        id="name"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="E-mail (tùy chọn)"
                                        id="email"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                            </div>
                        </SectionContainer>
                        {/* Address */}
                        <SectionContainer>
                            <SectionHeading>
                                Địa chỉ nhận hàng
                            </SectionHeading>
                            <div className="flex space-x-5">
                                <div className="flex-1">
                                    <Input
                                        label="Tỉnh/Thành phố"
                                        id="city"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Quận/Huyện"
                                        id="district"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Phường/Xã"
                                        id="ward"
                                        labelClasses="font-semibold text-sm"
                                        noBorder
                                    />
                                </div>
                            </div>
                        </SectionContainer>
                        {/* Thanh toan */}
                        <SectionContainer>
                            <SectionHeading>
                                Thông tin thanh toán
                            </SectionHeading>
                            <div className="text-sm font-medium mb-2">
                                Phương thức thanh toán
                            </div>
                            <div className="flex space-x-4 text-sm font-medium">
                                <div className="cursor-pointer h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all border-white hover:border-black">
                                    <div><FaRegMoneyBillAlt size={36} /></div>
                                    <div>Tiền mặt</div>
                                </div>
                                <div className="cursor-pointer h-32 w-24 bg-black text-white flex flex-col justify-center items-center select-none">
                                    <div><AiOutlineBank size={36} /></div>
                                    <div>Ngân hàng</div>
                                </div>
                                <div className="cursor-pointer h-32 w-24 bg-white flex flex-col justify-center items-center select-none border-2 transition-all border-white hover:border-black">
                                    <div><AiOutlineCreditCard size={36} /></div>
                                    <div>Thẻ tín dụng</div>
                                </div>
                            </div>
                        </SectionContainer>
                        {/* Ghi chu */}
                        <SectionContainer>
                            <SectionHeading>
                                Ghi chú
                            </SectionHeading>
                            <textarea rows={4} className="w-full resize-none p-3 text-gray-700" />
                        </SectionContainer>
                    </div>
                    <div className="w-4/12">
                        <SectionContainer>
                            <h3 className="text-lg font-semibold mb-2">Thống kê</h3>
                            <div className="flex justify-between text-gray-600 text-sm font-semibold mb-1">
                                <div>
                                    Tổng tiền sản phẩm:
                                </div>
                                <div>
                                    210,000,000đ
                                </div>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm font-semibold mb-1">
                                <div>
                                    Phí vận chuyển:
                                </div>
                                <div>
                                    50,000đ
                                </div>
                            </div>
                            <div className="flex justify-between text-2xl font-semibold mt-4">
                                <h4>
                                    Tổng tiền:
                                </h4>
                                <div>
                                    210,050,000đ
                                </div>
                            </div>
                        </SectionContainer>
                        <Button>
                            Thanh toán
                        </Button>
                    </div>
                </div>
            }
        </Layout>
    )
}