import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthForm({ modalClose }) {
    const [type, setType] = useState('LOGIN')
    return (
        <div className="px-10 py-4 bg-white max-w-md w-screen border mx-auto shadow-md">
            <div className="text-right py-2">
                <button onClick={() => modalClose()}><AiOutlineClose size={25} /></button>
            </div>
            <h3 className="text-xl mb-4">
                {type === 'LOGIN' && 'Đăng nhập tài khoản'}
                {type === 'REGISTER' && 'Đăng ký tài khoản'}
            </h3>
            {type === 'LOGIN' && <LoginForm modalClose={modalClose} />}
            {type === 'REGISTER' && <RegisterForm toLogin={() => setType('LOGIN')} />}
            <hr className="my-4" />
            <div className="text-center">
                {type === 'LOGIN' && (
                    <>
                        Chưa có tài khoản? <button className="font-semibold" onClick={() => setType('REGISTER')}>Đăng ký ngay!</button>
                    </>
                )}
                {type === 'REGISTER' && (
                    <>
                        Đã có tài khoản? <button className="font-semibold" onClick={() => setType('LOGIN')}>Đăng nhập!</button>
                    </>
                )}
            </div>
        </div>
    )
}