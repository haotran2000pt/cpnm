import { createContext, useContext, useEffect, useState } from 'react';
import { getUser } from './db';
import firebase from './firebase';

const authContext = createContext({
    initializing: null,
    auth: null,
    loading: null,
    setAuth: () => { },
    signInWithEmailAndPassword: async () => { },
    createUserWithEmailAndPassword: async () => { },
    signOut: async () => { },
    setAuth: () => { }
});

function useProvideAuth() {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true)


    const handleAuthChange = async (authState) => {
        let _error = null
        if (!authState) {
            setLoading(false);
            if (initializing)
                setInitializing(false)
            return;
        }
        firebase.firestore().collection('users').doc(authState.uid)
            .onSnapshot(async (user) => {
                try {
                    if (user.exists) {
                        setAuth({ ...user.data(), email: authState.email, id: authState.uid });
                    } else {
                        if (firebase.auth().currentUser) {
                            await firebase.auth().currentUser.delete()
                        }
                    }
                } catch (error) {
                    _error = error
                }
                setLoading(false);
                if (initializing)
                    setInitializing(false);
                if (_error)
                    throw _error
            })
    }

    const signInWithEmailAndPassword = async (email, password) => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(e => {
                setLoading(false)
                throw e
            })
    }

    const signOut = async () => {
        return firebase.auth().signOut().then(() => setAuth(null));
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthChange);
        return () => unsubscribe();
    }, []);

    return {
        initializing,
        auth,
        setAuth,
        loading,
        signInWithEmailAndPassword,
        signOut,
        setAuth
    };
}

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
