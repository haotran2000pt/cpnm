import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import Button from "../common/Button";
import Input from "../common/Input";

export default function LoginForm() {
    return (
        <>
            <Input
                label="Email"
                id="email"
            />
            <Input
                label="Mật khẩu"
                id="password"
            />
            <div className="text-right">
                <Link href='/forgot-password'>
                    <a>
                        Quên mật khẩu?
                    </a>
                </Link>
            </div>
            <Button className="mt-2">
                ĐĂNG NHẬP
            </Button>
        </>
    )
}