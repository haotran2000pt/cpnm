import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import Button from "../common/Button";
import Input from "../common/Input";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
    email: yup.string().required('Không thể để trống').email('Vui lòng nhập đúng định dạng'),
    password: yup.string().required('Không thể để trống').min(6, "Tối thiểu 6 kí tự"),
})

export default function LoginForm({ }) {
    const { loading, signInWithEmailAndPassword } = useAuth()
    const [error, setError] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })


    const handleLogin = async (data) => {
        try {
            await signInWithEmailAndPassword(data.email, data.password)
        } catch (error) {
            setError(error?.message || error)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            {error && (
                <div className="text-red-600 mb-2">
                    {error}
                </div>
            )}
            <Input
                label="Email"
                id="email"
                register={register('email')}
                error={errors?.email?.message}
            />
            <Input
                label="Mật khẩu"
                id="password"
                type="password"
                register={register('password')}
                error={errors?.password?.message}
            />
            <div className="text-right">
                <Link href='/forgot-password'>
                    <a>
                        Quên mật khẩu?
                    </a>
                </Link>
            </div>
            <Button className="mt-2" loading={loading}>
                ĐĂNG NHẬP
            </Button>
        </form>
    )
}