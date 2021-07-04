import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { LoadingPage } from '../components/common/LoadingPage';
import { getWishlist } from './db';
import firebase from './firebase';

const authContext = createContext({
    authUser: null,
    initialized: true,
    loading: false,
    setLoading: () => { },
    setAuthUser: () => { }
});

export const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const queryClient = useQueryClient()

    const authStateChanged = async (authState) => {
        if (!authState) {
            if (authUser) {
                await queryClient.invalidateQueries('wishlist', {
                    refetchInactive: true
                })
            }
            setAuthUser(null)
        }
        else {
            if (!loading)
                setLoading(true)
            const user = await firebase.firestore().collection('users').doc(authState.uid).get()
            queryClient.prefetchQuery(['wishlist', authState.uid], () => getWishlist(authState.uid), {
                staleTime: Infinity,
                cacheTime: Infinity
            })
            
            setAuthUser({ ...user.data(), email: authState.email, uid: authState.uid });
        }
        setLoading(false)
        if (!initialized) {
            setInitialized(true)
        }
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
        return () => unsubscribe()
    }, [])

    return {
        authUser,
        loading,
        initialized,
        setLoading,
        setAuthUser
    }
}

export function AuthProvider({ children }) {
    const auth = useFirebaseAuth();
    return (
        <authContext.Provider value={auth}>
            {auth.initialized ? children : <LoadingPage />}
        </authContext.Provider>
    );
}

export const useAuth = () => useContext(authContext);
