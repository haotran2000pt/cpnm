import dateFormat from "dateformat";
import qs from 'qs'
import sha256 from "sha256";

export const vnPayConfig = {
    secretKey: 'ZLNKXJBOLPNCDGMBBSKLINGNKPUIRHFG',
    tmnCode: 'TZFI2GR8'
}

export function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}


export const createVnPayUrl = (data) => {
    const { amount, ip, orderId } = data
    let params = {}

    params["vnp_Version"] = "2"
    params["vnp_Command"] = "pay"
    params["vnp_TmnCode"] = vnPayConfig.tmnCode
    params["vnp_Amount"] = amount * 100
    params["vnp_CreateDate"] = dateFormat(new Date(), "yyyymmddHHmmss");
    params["vnp_CurrCode"] = "VND"
    params["vnp_IpAddr"] = ip
    params["vnp_Locale"] = "vn"
    params["vnp_OrderInfo"] = "Thanh toan don hang CNPM thoi gian " + dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
    params["vnp_ReturnUrl"] = "http://localhost:3000/checkout/success"
    params["vnp_TxnRef"] = orderId;

    params = sortObject(params)

    const signData = vnPayConfig.secretKey + qs.stringify(params, { encode: false })
    const secureHash = sha256(signData)

    params["vnp_SecureHashType"] = "SHA256"
    params["vnp_SecureHash"] = secureHash
    const url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html?" + qs.stringify(params, { encode: false })

    return url
}