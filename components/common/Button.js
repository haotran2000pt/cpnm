import classNames from "classnames"
import LoadingIcon from "./LoadingIcon"

export default function Button({ children, white, className, loading, onClick, disable, ...props }) {
    return (
        <button
            disabled={loading}
            onClick={() => {
                if (!loading && onClick && !disable)
                    onClick()
            }}
            className={classNames('btn', {
                'bg-gray-100 cursor-not-allowed': loading || disable,
                'white': white && !loading && !disable,
                'dark': !white && !loading && !disable,
            }, className)}
            {...props}
        >
            {loading ? <LoadingIcon /> : children}
        </button>
    )
}