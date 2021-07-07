import Link from "next/link"
import qs from 'qs'
import sha256 from "sha256";
import { firebaseAdmin } from "../../lib/firebase-admin";
import { sortObject, vnPayConfig } from "../../utils/vnPay";

export async function getServerSideProps({ req }) {
    var vnp_Params = req.query;

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
            const bankCode = vnp_Params['vnp_BankCode']
            const bankTranNo = vnp_Params['vnp_BankTranNo']
            if (rspCode === '00') {
                const orderId = vnp_Params['vnp_TxnRef'];
                const orderRef = firebaseAdmin.firestore().collection('orders').doc(orderId)
                const order = (await orderRef.get()).data()

                return {
                    props: {
                        status: 'success',
                        order, transactionId, bankCode, bankTranNo
                    }
                }
            } else {
                return {
                    props: {
                        status: 'failed',
                        errCode: rspCode,
                        transactionId, bankCode, bankTranNo
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
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}

export default function CheckoutCompletePage({ status, errCode, transactionId, bankCode, bankTranNo, order }) {

    return (
        <div className="flex justify-center py-2">

            <div className="max-w-[600px] border p-2 shadow-md">
                {status === 'failed' && (
                    <>
                        <h1 className="p-2 border-b text-center text-red-500 bg-red-100 text-lg font-semibold">Giao dịch thất bại</h1>
                        <div className="my-2 space-y-2 text-sm text-gray-500">
                            <div className="flex">
                                <div className="w-[100px] font-semibold">Mã lỗi:</div>
                                <div>{errCode}</div>
                            </div>
                            <div className="flex">
                                <div className="w-[100px] font-semibold">Mã giao dịch VnPay:</div>
                                <div>{transactionId}</div>
                            </div>
                            <div className="flex">
                                <div className="w-[100px] font-semibold">Mã ngân hàng:</div>
                                <div>{bankCode}</div>
                            </div>
                            <div className="flex">
                                <div className="w-[100px] font-semibold">Mã giao dịch ngân hàng:</div>
                                <div>{bankTranNo}</div>
                            </div>
                            <div className="text-center text-lg font-medium">
                                Vui lòng liên hệ đến bộ phận kỹ thuật để biết thêm chi tiết <span className="text-red">1800 1111</span>
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