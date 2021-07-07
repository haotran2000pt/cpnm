import Link from "next/link"
import { useRouter } from "next/router";
import qs from 'qs'
import sha256 from "sha256";
import { PaymentMethod } from ".";
import Button from "../../components/common/Button";
import { getOrder } from "../../lib/db";
import numberWithCommas from "../../utils/numberWithCommas";
import { calcListItemPrice, calcSingleItemPrice } from "../../utils/priceCalc";
import { sortObject, vnPayConfig } from "../../utils/vnPay";

export async function getServerSideProps({ query }) {
    var vnp_Params = query;
    try {

        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var secretKey = vnPayConfig.secretKey

        var signData = secretKey + qs.stringify(vnp_Params, { encode: false });

        var checkSum = sha256(signData);

        if (secureHash === checkSum) {
            const rspCode = vnp_Params['vnp_ResponseCode']
            const transactionId = vnp_Params['vnp_TransactionNo']
            if (rspCode === '00') {
                const orderId = vnp_Params['vnp_TxnRef'];
                const bankCode = vnp_Params['vnp_BankCode'];
                const bankTranNo = vnp_Params['vnp_BankTranNo'];
                const order = await getOrder(orderId)
                return {
                    props: {
                        status: 'success',
                        order, transactionId, bankCode, bankTranNo,
                        payment: PaymentMethod.BANK
                    }
                }
            } else {
                return {
                    props: {
                        status: 'failed',
                        errCode: rspCode,
                        transactionId
                    }
                }
            }

        } else {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    } catch (e) {
        console.log(e.message)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}

export default function CheckoutCompletePage({ status, errCode, transactionId, bankCode, bankTranNo, payment, order }) {
    const router = useRouter()

    return (
        <div className="flex justify-center py-2">
            {status === 'failed' && (
                <div className="max-w-[600px] border p-2 shadow-md w-full">
                    <h1 className="p-2 border-b text-center text-red-500 bg-red-100 text-lg font-semibold">Giao dịch thất bại</h1>
                    <div className="my-2 space-y-2 text-sm text-gray-500">
                        <div className="flex">
                            <div className="flex-1 font-semibold">Mã lỗi:</div>
                            <div className="flex-1">{errCode}</div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 font-semibold">Mã giao dịch VnPay:</div>
                            <div className="flex-1">{transactionId}</div>
                        </div>
                        <div className="text-center text-lg font-medium">
                            Vui lòng liên hệ đến bộ phận kỹ thuật để biết thêm chi tiết <span className="text-red-500 font-semibold">1800 1111</span>
                        </div>
                        <div className="text-center">
                            <Link href="/">
                                <a className="text-blue-600 text-[15px] font-bold">Về trang chủ</a>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {status === 'success' && (
                <div className="max-w-[600px] w-full border">
                    <h1 className="p-2 border-b text-center bg-black text-white text-lg font-semibold">Giao dịch thành công</h1>
                    <div className="p-3 space-y-3">
                        <div className="text-center text-xl font-medium">Đơn hàng # {order.id}</div>
                        <div className="text-sm font-semibold">Địa chỉ giao hàng: {order.street}, {order.ward}, {order.district}, {order.city}</div>
                        <div className="text-sm font-semibold">Tên người nhận: {order.name}</div>
                        <div className="text-sm font-semibold">Số điện thoại: {order.phone}</div>
                        <div className="text-sm font-semibold">Email: {order.email}</div>
                        <div className="text-sm font-semibold">Phương thức thanh toán: {payment === PaymentMethod.COD ? "Tiền mặt" : "Ngân hàng"}</div>
                        {transactionId && <div className="text-sm font-semibold">Mã giao dịch VnPay: {transactionId}</div>}
                        {bankCode && <div className="text-sm font-semibold">Ngân hàng: {bankCode}</div>}
                        {bankTranNo && <div className="text-sm font-semibold">Mã giao dịch ngân hàng: {bankTranNo}</div>}
                        <h2 className="text-lg font-semibold">Sản phẩm:</h2>
                        <div className="p-3 bg-gray-100">
                            <table className="w-full">
                                <tr>
                                    <th className="pb-2">Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                </tr>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr className="font-semibold py-2">
                                            <td className="flex pb-2 pr-4">
                                                <div className="w-16 h-16">
                                                    <img src={item.product.images[0]} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex items-center ml-2">{item.product.name}</div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>{numberWithCommas(calcSingleItemPrice(item.product) * item.quantity)}đ</td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold text-xl">
                                        <td />
                                        <td className="p-4">
                                            TỔNG:
                                        </td>
                                        <td>
                                            {numberWithCommas(calcListItemPrice(order.items))}đ
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Button onClick={() => router.replace('/')} white>Về trang chủ</Button>
                    </div>
                </div>
            )}
        </div>
    )
}