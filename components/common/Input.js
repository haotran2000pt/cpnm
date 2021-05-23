import classNames from "classnames";

export default function Input({ label, id, labelClasses, inputClasses, noBorder, onChange, ...inputProps }) {
    return (
        <div className="mb-2">
            {label && (
                <div className='mb-1'>
                    <label className={labelClasses} htmlFor={id}>{label}</label>
                </div>
            )}
            <div>
                <input name={id} id={id}
                    className={classNames('w-full p-2 text-sm', inputClasses, {
                        'border border-black': !noBorder,
                    })}
                    onChange={onChange}
                    {...inputProps} />
            </div>
        </div>
    )
}