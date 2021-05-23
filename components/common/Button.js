import classNames from "classnames"

export default function Button({ children, white, className, ...props }) {
    return (
        <button
            className={classNames('w-full border-2 transition-colors font-medium', {
                'bg-white border-dark p-2 hover:bg-dark hover:text-white': white,
                'bg-dark text-white p-2 border-transparent hover:border-dark hover:text-black hover:bg-white': !white
            }, className)}
            {...props}
        >
            {children}
        </button>
    )
}