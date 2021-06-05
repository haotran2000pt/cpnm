import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { store } from "react-notifications-component";
import LoadingIcon from "../../components/common/LoadingIcon";
import AdminLayout from "../../layouts/AdminLayout";
import firebase from '../../lib/firebase'

const Input = ({ label, register, error, ...inputProps }) => (
    <div className="text-sm">
        <div className="text-blue-800 font-semibold mb-2">
            <label>{label}:</label>
        </div>
        <div>
            <input
                {...register}
                {...inputProps}
                className={classNames('w-full bg-white shadow-md border font-semibold p-2 rounded-lg text-gray-500', {
                    'border-red-400': error
                })}
            />
        </div>
        {error && <div className="mt-1 text-xs font-semibold text-red-500">{error}</div>}
    </div>
)

export default function Password() {
    const [currentError, setCurrentError] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
    const newPassword = watch('newPassword')

    const onSubmit = async () => {
        if (loading) return
        setCurrentError(false)
        if (currentPassword.length < 6) {
            let errorText = currentPassword.length === 0 ? 'Vui lòng nhập mật khẩu cũ' : "Vui lòng nhập đúng mật khẩu"
            setCurrentError(errorText)
            return
        }
        setLoading(true)
        try {
            const credential = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, currentPassword)
            await firebase.auth().currentUser.reauthenticateWithCredential(credential)
            await firebase.auth().currentUser.updatePassword(newPassword)
            setValue('newPassword', '')
            setValue('confirmPassword', '')
            setCurrentPassword('')
            store.addNotification({
                title: "Thành công",
                message: "Cập nhật mật khẩu thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        } catch (err) {
            console.log(err.message)
            setCurrentError('Sai mật khẩu')
        }
        setLoading(false)
    }

    return (
        <AdminLayout>
            <div className="mb-4">
                <h3 className="text-xl font-bold">Thay đổi mật khẩu</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs mx-auto space-y-4 my-2">
                <div>
                    <Input
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        label="Mật khẩu cũ"
                        type="password"
                        error={currentError}
                    />
                </div>
                <div>
                    <Input
                        register={register('newPassword', {
                            required: "Mật khẩu không thể để trống",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải tối thiểu 6 kí tự"
                            }
                        })}
                        label="Mật khẩu mới"
                        type="password"
                        error={errors?.newPassword?.message}
                    />
                </div>
                <div>
                    <Input
                        register={register('confirmPassword', {
                            validate: v => v === newPassword
                        })}
                        label="Xác nhận mật khẩu"
                        type="password"
                        error={errors.confirmPassword && "Không trùng với mật khẩu"}
                    />
                </div>
                <div>
                    <button className={classNames('w-full p-2 font-semibold rounded-lg', {
                        'cursor-not-allowed bg-gray-200 text-gray-600': loading,
                        'bg-blue-500 text-white hover:bg-blue-600': !loading
                    })}>
                        {loading ? <LoadingIcon /> : "Đổi mật khẩu"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    )
}