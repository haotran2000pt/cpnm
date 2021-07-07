import _ from 'lodash';
import firebase from './firebase';

const dbQuery = (baseQuery, params) => {
    let query = baseQuery
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
        query = query.limit(params.limit)
    }
    return query
}

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

export const getUsers = async (params) => {
    let query = firebase.firestore().collection('users')
    query = dbQuery(query, params)
    const users = await query.get()
    const data = users.docs.map(user => ({ id: user.id, ...user.data() }))
    return data
}

export const getProducts = async (params) => {
    let query = firebase.firestore().collection('products')
    query = dbQuery(query, params)
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

export const getOrder = async (id) => {
    const orderRef = await firebase.firestore().collection('orders').doc(id).get()
    if (!orderRef.exists) {
        return {}
    }
    const orderData = orderRef.data()
    const products = await getProducts({
        where: [{
            field: firebase.firestore.FieldPath.documentId(),
            op: 'in',
            value: orderData.items.map(item => item.id)
        }]
    })

    const order = {
        ...orderData,
        items: orderData.items.map(item => {
            const product = products.find(product => product.id === item.id)
            return {
                ...item,
                product
            }
        }),
        created_at: _.last(orderData.history).created_at,
        id: orderRef.id
    }

    return order
}

export const getOrders = async (params) => {
    try {
        let query = firebase.firestore().collection('orders')
        query = dbQuery(query, params)
        const ordersRef = await query.get()
        if (ordersRef.empty) {
            return []
        }
        const orders = await Promise.all(ordersRef.docs.map(async (orderRef) => {
            const orderData = orderRef.data()
            const products = await getProducts({
                where: [{
                    field: firebase.firestore.FieldPath.documentId(),
                    op: 'in',
                    value: orderData.items.map(item => item.id)
                }]
            })
            const order = {
                ...orderData,
                items: orderData.items.map(item => {
                    const product = products.find(product => product.id === item.id)
                    return {
                        ...item,
                        product
                    }
                }),
                created_at: _.last(orderData.history).created_at,
                id: orderRef.id
            }
            return order
        }))
        return orders
    } catch (e) {
        console.log(e)
        return []
    }

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