import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Layout from "../layouts/Layout";
import { AiOutlineLock } from "react-icons/ai";
import firebase from '../lib/firebase'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../lib/auth";
import { useRouter } from "next/router";
import LoadingIcon from "../components/common/LoadingIcon";
import { LoadingPage } from "../components/common/LoadingPage";

const schema = yup.object().shape({
    email: yup.string().required('Không được để trống').email('Vui lòng nhập đúng email')
})

export default function ForgotPassword() {
    const { authUser } = useAuth()
    const router = useRouter()

    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onReset = async (data) => {
        try {
            await firebase.auth().sendPasswordResetEmail(data.email);
            alert("Vui lòng kiểm tra email để tiến hành đổi mật khẩu!");
        } catch (e) {
            alert("Tài khoản không tồn tại")
        }
    }

    if (authUser) {
        router.push('/')
        return <LoadingPage />
    }

    return <Layout>
        <form onSubmit={handleSubmit(onReset)} className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-center w-20 h-20 mx-auto border-2 border-dark rounded-full mb-4">
                <AiOutlineLock className="inline-block" size={50} />
            </div>
            <h3 className="text-2xl font-medium text-center mb-3">Quên mật khẩu</h3>
            <Input
                error={errors?.email?.message}
                register={register('email')}
                label="Email"
                id="email"
            />
            <Button loading={isSubmitting} className="mt-2">Lấy lại mật khẩu</Button>
        </form>
    </Layout>
}
