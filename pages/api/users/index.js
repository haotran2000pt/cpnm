import moment from "moment"
import { firebaseAdmin } from "../../../lib/firebase-admin"

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let users
        try {
            const res = await firebaseAdmin.auth().listUsers(1000)

            users = res.users.reduce((filtered, userRecord) => {
                if (userRecord.email !== 'admin@admin.page') {
                    filtered.push({
                        email: userRecord.email,
                        uid: userRecord.uid,
                        create_date: moment(userRecord.metadata.creationTime).format('DD/MM/YYYY'),
                        last_sign: moment(userRecord.metadata.lastSignInTime).format('HH:mm DD/MM/YYYY'),
                    })
                }
                return filtered
            }, [])

            users = await Promise.all(users.map(async (user) => {
                const basicInfo = await firebaseAdmin.firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get()
                return {
                    ...user,
                    name: basicInfo.data().name,
                    phone: basicInfo.data().phone || "Chưa cập nhật"
                }
            }))

            users = await Promise.all(users.map(async (user) => {
                const orders = await firebaseAdmin.firestore()
                    .collection('orders')
                    .where('uid', '==', user.uid)
                    .get()

                return {
                    ...user,
                    orders: orders.docs.filter(order => order.data().status === 'Đã giao').length,
                    total_spend: orders.docs.reduce((total, order) => {
                        if (order.data().status === 'Đã giao') {
                            return total + order.data().totalPrice
                        } else {
                            return total
                        }
                    }, 0)
                }
            }))

        } catch (e) {
            return res.status(400).json({ message: e?.message || e })
        }
        return res.status(200).json(users)
    } else {
        return res.status(200).send('WRONG METHOD')
    }
}

export default handler
