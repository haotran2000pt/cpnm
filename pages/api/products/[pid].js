import { firebaseAdmin } from "../../../lib/firebase-admin"

const handler = async (req, res) => {
    const { pid } = req.query
    console.log(pid)
    if (req.method === 'DELETE') {
        try {
            const productRef = await firebaseAdmin.firestore().collection('products').doc(pid).get()
            if (productRef.data().soldUnits !== 0) {
                return res.status(400).send('Không thể xóa sản phẩm đã được bán')
            }
            await firebaseAdmin.firestore().collection('products').doc(pid).delete()
        } catch (e) {
            return res.status(400).json({ message: e?.message || e })
        }
        return res.status(200).send("Success")
    } else {
        return res.status(200).send('WRONG METHOD')
    }
}

export default handler
