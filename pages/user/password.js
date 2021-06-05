import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { store } from 'react-notifications-component'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import UserLayout from '../../layouts/UserLayout'
import firebase from '../../lib/firebase'

export default function UserPassword() {
    const [currentError, setCurrentError] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
    const newPassword = watch('newPassword')

    const onSubmit = async () => {
        setCurrentError(false)
        if (currentPassword.length < 6) {
            let errorText = currentPassword.length === 0 ? 'Vui lòng nhập mật khẩu cũ' : "Mật khẩu chưa đủ 6 kí tự"
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
            setCurrentError('Sai mật khẩu')
        }
        setLoading(false)
    }

    return (
        <UserLayout>
            <div className="border border-gray-400 shadow-md p-2">
                <h2 className="text-xl font-medium border-b pb-2 mb-2">Thay đổi mật khẩu</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
                    <div className="max-w-xs mx-auto">
                        <Input
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            label="Mật khẩu cũ"
                            type="password"
                            error={currentError}
                        />
                    </div>
                    <div className="max-w-xs mx-auto">
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
                    <div className="max-w-xs mx-auto">
                        <Input
                            register={register('confirmPassword', {
                                validate: v => v === newPassword
                            })}
                            label="Xác nhận mật khẩu"
                            type="password"
                            error={errors.confirmPassword && "Không trùng với mật khẩu"}
                        />
                    </div>
                    <div className="max-w-xs mx-auto">
                        <Button loading={loading}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </div>
        </UserLayout>
    )
}