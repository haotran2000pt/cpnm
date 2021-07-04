import classNames from "classnames";

export const Label = ({ children, ...labelProps }) => (
    <div>
        <label {...labelProps}>{children}</label>
    </div>
)

export const Error = ({ children, className }) => (
    <div className={classNames('text-red-400 text-xs', className)}>{children}</div>
)

export default function Input({ label, className, htmlFor, error, inputProps, placeholder }) {
    return (
        <>
            {label && <Label htmlFor={htmlFor}>{label}</Label>}
            <div className="w-full">
                <input id={htmlFor} {...inputProps}
                    placeholder={placeholder}
                    className={classNames(className, 'w-full bg-admin-100 border font-semibold p-2 rounded-lg text-gray-600', {
                        'border-red-400': error
                    })}
                />
            </div>
            {error && <Error>{error}</Error>}
        </>
    )
}