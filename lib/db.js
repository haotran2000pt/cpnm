import firebase from './firebase';

export const addUser = async (uid, authUser) => {
    const resp = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .set(authUser);
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