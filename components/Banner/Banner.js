import Link from "next/link";

export default function Banner({ item, className }) {
    return (
        <div className={className}>
            <Link href={item.href}>
                <a>
                    <img style={{maxHeight:400}} className="w-full h-auto object-cover" src={item.src} alt={item.alt} />
                </a>
            </Link>
        </div>
    )
}