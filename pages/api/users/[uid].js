import { firebaseAdmin } from "../../../lib/firebase-admin"

const handler = async (req, res) => {
    const { uid } = req.query
    if (req.method === 'DELETE') {
        try {
            await firebaseAdmin.auth().deleteUser(uid)
        } catch (e) {
            return res.status(400).json({ message: e?.message || e })
        }
        return res.status(200).send("Success")
    } else {
        return res.status(200).send('WRONG METHOD')
    }
}

export default handler
