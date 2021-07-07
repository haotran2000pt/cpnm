import { sortObject, vnPayConfig } from '../../utils/vnPay';
import qs from 'qs'
import sha256 from 'sha256';

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
            switch (rspCode) {
                case 0:
                    break;
                default:
                    break;
            }
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            res.status(200).json({ RspCode: '00', Message: 'success' })
        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
        }
    } else {
        return res.status(400).send('NOT SUPPORT METHOD')
    }
}

export default handler