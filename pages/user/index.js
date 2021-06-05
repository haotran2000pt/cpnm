import { useForm } from 'react-hook-form'
import Button from '../../components/common/Button'
import UserLayout from '../../layouts/UserLayout'
import { useAuth } from '../../lib/auth'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import firebase from '../../lib/firebase'
import { store } from 'react-notifications-component';

const Row = ({ children }) => (<div className="flex space-x-4 items-center">{children}</div>)

const Left = ({ children }) => (<div className="text-right w-40">{children}</div>)

const Right = ({ children }) => (<div className="flex-1 max-w-md">{children}</div>)

const Input = ({ error, inputProps }) => (
    <div>
        <input
            {...inputProps}
            className={classNames("w-full bg-gray-200 p-2 text-sm font-medium border", {
                'border-red-500': error
            })} />
        {error && <div className="text-xs font-semibold text-red-500 absolute">{error}</div>}
    </div>
)

const schema = yup.object().shape({
    phone: yup.string().required('Không thể để trống').matches(/^0[0-9]+$/, 'Số điện thoại không hợp lệ').min(10, 'Số điện thoại không hợp lệ').max(10, 'Số điện thoại không hợp lệ'),
    name: yup.string().required('Không thể để trống'),
    city: yup.string().required('Không thể để trống'),
    district: yup.string().required('Không thể để trống'),
    ward: yup.string().required('Không thể để trống'),
    street: yup.string().required('Không thể để trống'),
})

export default function User() {
    const { auth, setAuth } = useAuth()
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(schema)
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (auth) {
            const { id, ...authData } = auth
            reset(authData)
        }
    }, [auth])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await firebase.firestore().collection('users').doc(auth.id).set(data, { merge: true })
            setAuth({
                ...auth,
                ...data
            })
            store.addNotification({
                title: "Thành công",
                message: "Cập nhật tài khoản thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        }
        catch (err) {
            store.addNotification({
                title: "Thất bại",
                message: "Không thể cập nhật tài khoản\n" + err?.message || err,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
        setLoading(false)
    }

    return (
        <UserLayout>
            <div className="border border-gray-400 shadow-md p-2">
                <h2 className="text-xl font-medium border-b pb-2 mb-2">Thông tin tài khoản</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="text-gray-600 space-y-4">
                    <Row>
                        <Left>Họ tên:</Left>
                        <Right>
                            <Input
                                inputProps={register('name')}
                                error={errors?.name?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left>Số điện thoại:</Left>
                        <Right>
                            <Input
                                inputProps={register('phone')}
                                error={errors?.phone?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left>Email:</Left>
                        <Right>
                            <div className="w-full bg-gray-200 p-2 text-sm font-medium select-none">
                                {auth?.email}
                            </div>
                        </Right>
                    </Row>
                    <Row>
                        <Left>Tỉnh/Thành phố:</Left>
                        <Right>
                            <Input
                                inputProps={register('city')}
                                error={errors?.city?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left>Quận/Huyện:</Left>
                        <Right>
                            <Input
                                inputProps={register('district')}
                                error={errors?.district?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left>Xã/Phường:</Left>
                        <Right>
                            <Input
                                inputProps={register('ward')}
                                error={errors?.ward?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left>Tên đường, số nhà:</Left>
                        <Right>
                            <Input
                                inputProps={register('street')}
                                error={errors?.street?.message}
                            />
                        </Right>
                    </Row>
                    <Row>
                        <Left />
                        <Right>
                            <Button loading={loading}>
                                Cập nhật
                            </Button>
                        </Right>
                    </Row>
                </form>
            </div>
        </UserLayout>
    )
}