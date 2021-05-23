import classNames from "classnames";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout({ children, aboveComponent }) {
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