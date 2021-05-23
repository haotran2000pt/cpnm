import { MdRemoveShoppingCart } from 'react-icons/md'
import Link from 'next/link'

export default function CheckoutEmpty() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-2">
                <MdRemoveShoppingCart size={60} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
                Giỏ hàng trống.
                </h3>
            <div className="max-w-md text-center text-sm">
                Không có sản phẩm nào trong giỏ hàng. Bấm vào
                    {' '}<Link href="/"><a className="text-blue-500">đây</a></Link>{' '}
                    để trở về trang chủ và tiếp tục mua sắm!
                </div>
        </div>
    )
}