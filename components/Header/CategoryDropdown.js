import Link from "next/link";
import { categories } from "../../constants/category";

export default function CategoryDropdown({ closeHandler }) {

    return (
        <nav className="shadow-md">
            <ul>
                {Object.keys(categories).map((catId) => {
                    const category = categories[catId]
                    return (
                        <li key={catId + 'headerlink'}>
                            <Link href={'/' + catId}>
                                <a onClick={closeHandler} className="p-2 px-3 w-full block hover:bg-dark hover:text-white font-medium">
                                    {category.name}
                                </a>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}