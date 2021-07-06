import _ from "lodash"
import { firebaseAdmin } from "../../../lib/firebase-admin"
import ratingCalculate from "../../../utils/ratingCalculate"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { pid, uid, ratingDetails, token, ...data } = req.body

            const user = await firebaseAdmin.auth().verifyIdToken(token)

            if (user.uid !== uid) {
                return res.status(400).json({ message: "NOT AUTHORIZED" })
            }

            const batch = firebaseAdmin.firestore().batch()

            const productRef = firebaseAdmin.firestore().collection('products').doc(pid)
            const ratingRef = productRef.collection('ratings').doc(uid)

            const rating = await ratingRef.get()

            if (rating.exists) {
                return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm rồi" })
            }

            if (_.isNil(ratingDetails) || _.isEmpty(ratingDetails)) {
                batch.update(productRef, {
                    ratingDetails: {
                        1: data.rating === 1 ? 1 : 0,
                        2: data.rating === 2 ? 1 : 0,
                        3: data.rating === 3 ? 1 : 0,
                        4: data.rating === 4 ? 1 : 0,
                        5: data.rating === 5 ? 1 : 0
                    },
                    ratingCount: 1,
                    avgRating: data.rating
                })
            } else {
                const [totalRating, ratingCount] = ratingCalculate(ratingDetails)
                const avgRating = parseFloat(((totalRating + data.rating) / (ratingCount + 1)).toFixed(1))
                batch.update(productRef, {
                    [`ratingDetails.${data.rating}`]: firebaseAdmin.firestore.FieldValue.increment(1),
                    ratingCount: firebaseAdmin.firestore.FieldValue.increment(1),
                    avgRating: avgRating
                })
            }
            batch.set(ratingRef, data)
            await batch.commit()
        } catch (e) {
            return res.status(400).json({ message: e?.message || e })
        }
        return res.status(200).json({ message: "Success" })
    } else {
        return res.status(200).send('NOT SUPPORT METHOD')
    }
}

export default handler
