import classNames from "classnames";

export default function Input({ error, label, id, labelClasses, inputClasses, noBorder, onChange, register, ...inputProps }) {
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
                        'border border-red-400': error,
                    })}
                    onChange={onChange}
                    {...register}
                    {...inputProps} />
            </div>
            {error && <div className="mb-4"><div className="absolute text-red-500 text-xs font-semibold">{error}</div></div>}
        </div>
    )
}