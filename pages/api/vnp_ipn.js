import { sortObject, vnPayConfig } from '../../utils/vnPay';
import qs from 'qs'
import sha256 from 'sha256';
import { firebaseAdmin } from '../../lib/firebase-admin';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var secretKey = vnPayConfig.secretKey
        var signData = secretKey + qs.stringify(vnp_Params, { encode: false });

        var checkSum = sha256(signData);

        if (secureHash === checkSum) {
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            const orderRef = firebaseAdmin.firestore().collection('orders').doc(orderId)
            const orderData = await orderRef.get()
            if (orderData.exists) {
                const order = orderData.data()
                if (order.totalPrice === parseInt(vnp_Params['vnp_Amount']) / 100) {
                    if (order.paymentInfo.status === 'pending') {
                        if (rspCode == "0") {
                            await orderRef.update({
                                paymentInfo: {
                                    status: "success",
                                    transactionId: vnp_Params['vnp_TransactionNo'],
                                    bankCode: vnp_Params['vnp_BankCode'],
                                    bankTranNo: vnp_Params['vnp_BankTranNo'],
                                    payDate: vnp_Params['vnp_PayDate']
                                }
                            })
                            return res.status(200).json({ RspCode: '00', Message: 'Giao dịch thành công' })
                        } else {
                            await orderRef.update({
                                paymentInfo: {
                                    status: "failed",
                                    transactionId: vnp_Params['vnp_TransactionNo'],
                                    bankCode: vnp_Params['vnp_BankCode'],
                                    bankTranNo: vnp_Params['vnp_BankTranNo'],
                                    payDate: vnp_Params['vnp_PayDate'],
                                    errorCode: rspCode
                                }
                            })
                            return res.status(200).json({ RspCode: '99', Message: 'Giao dịch thất bại' })
                        }
                    } else {
                        return res.status(200).json({ RspCode: '01', Message: 'Giao dịch đã được xác nhận' })
                    }
                } else {
                    return res.status(200).json({ RspCode: '04', Message: 'Sai số tiền' })
                }
            } else {
                return res.status(200).json({ RspCode: '06', Message: 'Không tồn tại đơn hàng' })
            }
        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
        }
    } else {
        return res.status(400).send('NOT SUPPORT METHOD')
    }
}

export default handler