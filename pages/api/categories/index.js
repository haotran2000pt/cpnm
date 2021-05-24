import { db } from "../../../lib/firebase-admin";

export default async function handler(req, res) {
    try {
        const categoriesSnapshot = await db.collection('categories').get();
        const categoriesData = categoriesSnapshot.docs.map(category => ({ id: category.id, ...category.data() }))
        res.status(200).json(categoriesData);
    } catch (e) {
        res.status(400).end();
    }
}