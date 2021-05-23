import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Layout from "../layouts/Layout";
import { AiOutlineLock } from "react-icons/ai";

export default function ForgotPassword() {
    return <Layout>
        <div className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-center w-20 h-20 mx-auto border-2 border-dark rounded-full mb-4">
                <AiOutlineLock className="inline-block" size={50} />
            </div>
            <h3 className="text-2xl font-medium text-center mb-3">Quên mật khẩu</h3>
            <Input
                label="Email"
                id="email"
            />
            <Button className="mt-2">Lấy lại mật khẩu</Button>
        </div>
    </Layout>
}
