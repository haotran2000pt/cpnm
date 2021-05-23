import classNames from "classnames"
import LoadingIcon from "./LoadingIcon"

export default function Button({ children, white, className, loading, onClick, ...props }) {
    return (
        <button
            disabled={loading}
            onClick={() => {
                if (!loading && onClick)
                    onClick()
            }}
            className={classNames('btn', {
                'bg-gray-100 cursor-not-allowed': loading,
                'white': white && !loading,
                'dark': !white && !loading
            }, className)}
            {...props}
        >
            {loading ? <LoadingIcon /> : children}
        </button>
    )
}