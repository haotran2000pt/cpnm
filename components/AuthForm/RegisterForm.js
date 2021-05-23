import { useState } from "react"
import { useAuth } from "../../lib/auth"
import Button from "../common/Button"
import Input from "../common/Input"

export default function RegisterForm() {
    const { loading, error, clearError, createUserWithEmailAndPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleRegister = () => {
        clearError()
        createUserWithEmailAndPassword(email, password, name)
    }

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
                label="Họ tên"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <Input
                label="Mật khẩu"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Input
                label="Xác nhận mật khẩu"
                id="confirm-password"
            />
            <Button onClick={handleRegister} loading={loading} className="mt-2">
                ĐĂNG KÝ
            </Button>
        </>
    )
}