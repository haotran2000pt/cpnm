import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingIcon from "../components/common/LoadingIcon";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import { useAuth } from "../lib/auth";
import firebase from '../lib/firebase'

export default function Layout({ children, aboveComponent }) {
    const { initializing, auth } = useAuth()
    const [aboutBrand, setAboutBrand] = useState(null)
    const router = useRouter()

    useEffect(async () => {
        const about = await firebase.firestore()
            .collection('about_store')
            .doc('main_info')
            .get()
        setAboutBrand(about.data())
    }, [])

    if (typeof window !== 'undefined' && auth?.role === 'admin') {
        router.push('/admin')
        return null
    }

    if (initializing || typeof window === 'undefined' || !aboutBrand) {
        return <div className="w-screen h-screen flex-center">
            <LoadingIcon />
        </div>
    }


    return <div>
        <Header info={aboutBrand} />
        {aboveComponent &&
            <div className="mb-3">
                {aboveComponent}
            </div>
        }
        <main className={classNames('max-w-7xl mx-auto p-3')}>
            {children}
        </main>
        <Footer info={aboutBrand} />
    </div>
}