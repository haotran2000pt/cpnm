import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import Button from "../common/Button";
import Input from "../common/Input";

export default function LoginForm() {
    const { loading, signInWithEmailAndPassword, error, clearError } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        clearError()
        signInWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        clearError()
    }, [])

    return (
        <>
            {error && (
                <div className="text-red-600 mb-2">
                    {error}
                </div>
            )}
            <Input
                label="Email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <Input
                label="Mật khẩu"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <div className="text-right">
                <Link href='/forgot-password'>
                    <a>
                        Quên mật khẩu?
                    </a>
                </Link>
            </div>
            <Button onClick={handleLogin} className="mt-2" loading={loading}>
                ĐĂNG NHẬP
            </Button>
        </>
    )
}