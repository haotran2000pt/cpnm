import _ from 'lodash';
import firebase from './firebase';

export const updateUser = (uid, data) => {
    return firebase.firestore().collection('users').doc(uid).update(data)
}

export const getUser = async (uid) => {
    const resp = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
    return resp;
}

export const getProducts = async (params) => {
    let query = firebase.firestore().collection('products')
    if (params.where) {
        params.where.forEach(param => {
            query = query.where(param.field, param.op, param.value)
        })
    }
    if (params.order) {
        params.order.forEach(param => {
            query = query.orderBy(param.field, param.direct)
        })
    }
    if (params.limit) {
        query.limit(params.limit)
    }
    const products = await query.get()
    const data = products.docs.map(product => ({ id: product.id, ...product.data() }))
    return data;
}

export const getProduct = async (id) => {
    const product = await firebase.firestore()
        .collection('products')
        .where("slug", "==", id)
        .get()
    if (!product.empty) {
        const productData = product.docs[0].data()
        const data = { ...productData, id: product.docs[0].id }
        return data
    } else {
        return null;
    }
}

export const getOrders = async () => {
    const orders = await firebase.firestore().collection('orders').get()
    const data = orders.docs.map(order => ({ id: order.id, created_at: _.last(order.data().history).created_at, ...order.data() }))
    return data
}

export const getGlobalData = async () => {
    const storeInfoRef = await firebase.firestore().collection('about_store').doc('main_info').get()
    const storeInfo = storeInfoRef.data()
    return { storeInfo }
}

export const getWishlist = async (uid) => {
    if (_.isNil(uid)) {
        return []
    }

    const wishlistRef = await firebase.firestore().collection('wishlists').doc(uid).get()
    if (wishlistRef.exists) {
        const wishlists = _.keys(wishlistRef.data())
        if (_.isEmpty(wishlists)) {
            return []
        }

        const products = await getProducts({
            where: [{
                field: firebase.firestore.FieldPath.documentId(),
                op: 'in',
                value: wishlists
            }]
        })

        return products

    } else {
        return []
    }
}

export const addWishlist = async (uid, product) => {
    const data = {}
    data[product.id] = Date.now()

    try {
        await firebase.firestore().collection('wishlists').doc(uid).set(data, { merge: true })
        return product
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const removeWishlist = async (uid, product) => {
    const data = {}
    data[product.id] = firebase.firestore.FieldValue.delete()

    try {
        await firebase.firestore().collection('wishlists').doc(uid).update(data)
        return product
    } catch (e) {
        console.log(e)
        throw e
    }
}