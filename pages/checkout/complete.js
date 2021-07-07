import Link from "next/link"
import qs from 'qs'
import sha256 from "sha256";
import { firebaseAdmin } from "../../lib/firebase-admin";
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
                const orderData = await firebaseAdmin.firestore().collection('orders').doc(orderId).get()
                const order = orderData.data()
                return {
                    props: {
                        status: 'success',
                        order, transactionId
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

export default function CheckoutCompletePage({ status, errCode, transactionId, order }) {

    return (
        <div className="flex justify-center py-2">

            <div className="max-w-[600px] border p-2 shadow-md">
                {status === 'failed' && (
                    <>
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
                    </>
                )}
                {status === 'success' && (
                    <div>Giao dịch thành công</div>
                )}
            </div>
        </div>
    )
}