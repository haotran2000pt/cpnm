import _ from 'lodash';
import firebase from './firebase';

export const addUser = async (uid, authUser) => {
    const resp = await firebase
        .firestore()
        .collection('users')
    return resp;
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