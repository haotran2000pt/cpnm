import Link from "next/link";

const Categories = [{
    href: "/asd",
    text: "Điện thoại"
}, {
    href: "/asd",
    text: "Máy tính bảng"
}, {
    href: "/asd",
    text: "Tai nghe"
}, {
    href: "/asd",
    text: "Smartwatch"
}, {
    href: "/asd",
    text: "Máy ảnh"
}
]

export default function CategoryDropdown() {
    return (
        <nav className="shadow-md">
            <ul>
                {Categories.map((category) => (
                    <li>
                        <Link href={category.href}>
                            <a className="p-2 px-3 w-full block hover:bg-dark hover:text-white font-medium">
                                {category.text}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}