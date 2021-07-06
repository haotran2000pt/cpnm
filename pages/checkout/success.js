import dateFormat from "dateformat";
import Link from "next/link"
import qs from 'qs'
import sha256 from "sha256";

export async function getServerSideProps({ req }) {
    const headers = req.headers
    return {
        props: { headers }
    }
}
function sortObject(o) {
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

export default function SuccessPage({ headers }) {
    let params = {}

    const secretKey = "ZLNKXJBOLPNCDGMBBSKLINGNKPUIRHFG"

    params["vnp_Version"] = "2"
    params["vnp_Command"] = "pay"
    params["vnp_TmnCode"] = "TZFI2GR8"
    params["vnp_Amount"] = 1000000
    params["vnp_CreateDate"] = dateFormat(new Date(), "yyyymmddHHmmss");
    params["vnp_CurrCode"] = "VND"
    params["vnp_IpAddr"] = "113.188.209.5"
    params["vnp_Locale"] = "vn"
    params["vnp_OrderInfo"] = "Nap tien cho thue bao 0123456789. So tien 100,000 VND"
    params["vnp_ReturnUrl"] = "http://localhost:3000/checkout/success"
    params["vnp_TxnRef"] = dateFormat(new Date(), "HHmmss");
    params["vnp_SecureHashType"] = "SHA256"

    params = sortObject(params)

    const signData = secretKey + qs.stringify(params, { encode: false })
    console.log(signData)
    const secureHash = sha256(signData)

    params["vnp_SecureHash"] = secureHash
    const url = "?" + qs.stringify(params, { encode: false })
    console.log(url)

    return (
        <>
            <Link href={`http://sandbox.vnpayment.vn/paymentv2/vpcpay.html${url}`}>
                <a>asdasd</a>
            </Link>
            <div>
                <button onClick={() => console.log(headers)}>headers</button>
            </div>
        </>
    )
}