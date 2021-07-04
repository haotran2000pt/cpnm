import { firebaseAdmin } from "../../lib/firebase-admin"
import { UserRole } from '../../constants/user'

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let bodyError = ''
            const email = req.body.email
            if (!email) bodyError += 'Email không thể để trống\n'
            const password = req.body.password
            if (!password) bodyError += 'Mật khẩu không thể để trống\n'
            const name = req.body.name
            if (!name) bodyError += 'Tên không thể để trống\n'

            if (bodyError) {
                return res.status(400).json({ message: bodyError })
            }

            const user = await firebaseAdmin.auth()
                .createUser({
                    email,
                    password,
                })

            try {
                await firebaseAdmin.firestore()
                    .collection('users')
                    .doc(user.uid)
                    .set({
                        name,
                        role: UserRole.USER,
                        wishlist: []
                    });
            } catch (e) {
                await firebaseAdmin.auth().deleteUser(user.uid)
                throw new Error('Lỗi máy chủ')
            }
        } catch (e) {
            return res.status(400).json({ message: e?.message || e })
        }
        return res.status(200).json({ success: true })
    } else {
        return res.status(200).send('WRONG METHOD')
    }
}

export default handler
