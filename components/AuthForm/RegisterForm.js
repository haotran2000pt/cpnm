import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../../lib/auth"
import Button from "../common/Button"
import Input from "../common/Input"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

const schema = yup.object().shape({
    name: yup.string().required('Không thể để trống'),
    email: yup.string().required('Không thể để trống').email('Vui lòng nhập đúng định dạng'),
    password: yup.string().required('Không thể để trống').min(6, "Tối thiểu 6 kí tự"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng')
})


export default function RegisterForm({ toLogin }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const handleRegister = async (data) => {
        setLoading(true)
        try {
            setError('')
            await axios.post('/api/register', data)
            alert('Đăng ký thành công!')
            toLogin()
        } catch (error) {
            setError(error.response?.data?.message || "Lỗi máy chủ")
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(handleRegister)}>
            {error && (
                <div className="text-red-600 mb-2 whitespace-pre-wrap">
                    {error}
                </div>
            )}
            <Input
                register={register('email')}
                label="Email"
                id="email"
                error={errors?.email?.message}
            />
            <Input
                register={register('name')}
                label="Họ tên"
                id="name"
                error={errors?.name?.message}
            />
            <Input
                register={register('password')}
                label="Mật khẩu"
                id="password"
                type="password"
                error={errors?.password?.message}
            />
            <Input
                register={register('confirmPassword')}
                label="Xác nhận mật khẩu"
                type="password"
                error={errors.confirmPassword && "Không trùng với mật khẩu"}
            />
            <Button loading={loading} className="mt-2">
                ĐĂNG KÝ
            </Button>
        </form>
    )
}