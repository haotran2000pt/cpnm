import classNames from "classnames";
import { CompareButton } from "../components/Compare/CompareOverlay/CompareOverlay";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";

export default function Layout({ children, aboveComponent, noCompare }) {
    return <div className="min-w-[1400px]">
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
        <div className="fixed right-5 bottom-5">
            {!noCompare && <CompareButton />}
        </div>
    </div>
}