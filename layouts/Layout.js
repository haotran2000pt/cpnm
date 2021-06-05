import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingIcon from "../components/common/LoadingIcon";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import { useAuth } from "../lib/auth";

export default function Layout({ children, aboveComponent }) {
    const { initializing, auth } = useAuth()
    const router = useRouter()

    if (typeof window !== 'undefined' && auth?.role === 'admin') {
        router.push('/admin')
        return null
    }

    if (initializing || typeof window === 'undefined') {
        return <div className="w-screen h-screen flex-center">
            <LoadingIcon />
        </div>
    }

    return <div>
        <Header />
        {aboveComponent &&
            <div className="mb-3">
                {aboveComponent}
            </div>
        }
        <main className={classNames('max-w-7xl mx-auto p-3')}>
            {children}
        </main>
        <Footer />
    </div>
}