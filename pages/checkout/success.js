import Link from "next/link"
import qs from 'querystring'

export async function getServerSideProps({ req }) {
    const headers = req.headers
    return {
        props: { headers }
    }
}

export default function SuccessPage({ headers }) {
    let params = {}

    params["vnp_Version"] = "2"
    params["vnp_Command"] = "pay"
    params["vnp_TmnCode"] = "TZFI2GR8"
    params["vnp_Amount"] = 1000000
    params["vnp_CreateDate"] = 20210706103111
    params["vnp_CurrCode"] = "VND"
    params["vnp_IpAddr"] = "113.188.209.5"
    params["vnp_Locale"] = "vn"
    params["vnp_OrderInfo"] = "Nap tien cho thue bao 0123456789. So tien 100,000 VND"
    params["vnp_ReturnUrl"] = "https://cpnm.vercel.app/checkout/success"
    params["vnp_TxnRef"] = "SD92MEO92"
    params["vnp_SecureHashType"] = "SHA256"
    params["vnp_Command"] = "081f2e38cd5975e5979b982667b62df4c2f6601efd68fe5b87c0caef2d512cd7"

    const requestParams = qs.stringify(params)

    return (
        <>
            <Link href={`http://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${requestParams}`}>
                <a>asdasd</a>
            </Link>
            <div>
                <button onClick={() => console.log(headers)}>headers</button>
            </div>
        </>
    )
}