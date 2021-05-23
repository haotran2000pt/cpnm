import { createContext, useContext, useEffect, useState } from 'react';
import { addUser, getUser } from './db';
import firebase from './firebase';

const authContext = createContext({
    auth: null,
    error: null,
    loading: true,
    signInWithEmailAndPassword: async () => { },
    createUserWithEmailAndPassword: async () => { },
    signOut: async () => { },
    clearError: () => { }
});

function useProvideAuth() {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(true);
    const [creating, setCreating] = useState(false)

    const handleAuthChange = async (authState) => {
        if (!authState || creating) {
            setLoading(false);
            return;
        }
        try {
            const user = await getUser(authState.uid)
            if (user.exists)
                setAuth({ ...user.data(), email: authState.email });
            else {
                setError('Tài khoản không tồn tại')
                if (firebase.auth().currentUser) {
                    await firebase.auth().currentUser.delete()
                }
            }
        } catch (error) {
            setError(error.message)
        }
        setLoading(false);
    };

    const signedIn = async (response) => {
        setLoading(false)
        if (!response.user) {
            throw new Error('No User');
        }
    };

    const signUp = async (response, name) => {
        setCreating(true)
        try {
            await addUser(response.user.uid, {
                name,
            })
            alert('Đăng ký thành công')
            setCreating(false)
            handleAuthChange()
        } catch (error) {
            firebase.auth().currentUser.delete()
            setCreating(false)
            throw new Error('Lỗi máy chủ!')
        }
        setLoading(false)
    }

    const clear = () => {
        setAuth(null);
        setLoading(true);
        setError(null)
    };

    const clearError = () => {
        setError(null)
    }

    const signInWithEmailAndPassword = async (email, password) => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(signedIn)
            .catch((error) => {
                setLoading(false)
                setError(error.message)
            })
    }

    const createUserWithEmailAndPassword = async (email, password, name) => {
        setLoading(true)
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(resp => signUp(resp, name))
            .catch((error) => {
                setLoading(false)
                setError(error.message)
            })
    }

    const signOut = async () => {
        return firebase.auth().signOut().then(clear);
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthChange);
        return () => unsubscribe();
    }, []);

    return {
        auth,
        loading,
        error,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        clearError
    };
}

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
