import Button from "../common/Button"
import Input from "../common/Input"

export default function RegisterForm() {
    return (
        <>
            <Input
                label="Email"
                id="email"
            />
            <Input
                label="Họ tên"
                id="name"
            />
            <Input
                label="Mật khẩu"
                id="password"
            />
            <Input
                label="Xác nhận mật khẩu"
                id="confirm-password"
            />
            <Button className="mt-2">
                ĐĂNG KÝ
            </Button>
        </>
    )
}