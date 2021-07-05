import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { store } from "react-notifications-component";
import LoadingIcon from "../../components/common/LoadingIcon";
import { UserRole } from "../../constants/user";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../lib/auth";
import firebase from '../../lib/firebase'

const Input = ({ label, register, error, ...inputProps }) => (
    <div className="text-sm">
        <div className="text-blue-800 font-semibold mb-2">
            <label>{label}:</label>
        </div>
        <div>
            <input
                {...register}
                {...inputProps}
                className={classNames('w-full bg-white shadow-md border font-semibold p-2 rounded-lg text-gray-500', {
                    'border-red-400': error
                })}
            />
        </div>
        {error && <div className="mt-1 text-xs font-semibold text-red-500">{error}</div>}
    </div>
)

export async function getServerSideProps() {
    const info = await firebase.firestore()
        .collection('about_store')
        .doc('main_info')
        .get()
    return {
        props: {
            info: info.data()
        }
    }
}

export default function Info({ info }) {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: info
    })
    const { authUser } = useAuth()

    const onSubmit = async (data) => {
        if (loading) return
        setLoading(true)
        try {
            await firebase.firestore()
                .collection('about_store')
                .doc('main_info')
                .update(data)
            store.addNotification({
                title: "Thành công",
                message: "Cập nhật thông tin doanh nghiệp thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
        setLoading(false)
    }

    return (
        <AdminLayout>
            <div className="mb-4">
                <h3 className="text-xl font-bold">Cập nhật thông tin doanh nghiệp</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={authUser.role === UserRole.MODERATOR} className="max-w-xs mx-auto space-y-4 my-2">
                    <div>
                        <Input
                            register={register('name', {
                                required: "Không thể để trống",
                            })}
                            label="Tên doanh nghiệp"
                            error={errors?.name?.message}
                        />
                    </div>
                    <div>
                        <Input
                            register={register('address', {
                                required: "Không thể để trống"
                            })}
                            label="Địa chỉ"
                            error={errors?.address?.message}
                        />
                    </div>
                    <div>
                        <Input
                            register={register('advise_tel', {
                                required: "Không thể để trống"
                            })}
                            label="Số tư vấn mua hàng"
                            error={errors?.advise_tel?.message}
                        />
                    </div>
                    <div>
                        <Input
                            register={register('technic_tel', {
                                required: "Không thể để trống"
                            })}
                            label="Số hỗ trợ kỹ thuật"
                            error={errors?.technic_tel?.message}
                        />
                    </div>
                    <div>
                        <Input
                            register={register('facebook_fanpage', {
                                required: "Không thể để trống"
                            })}
                            label="Facebook Fanpage"
                            error={errors?.facebook_fanpage?.message}
                        />
                    </div>
                    {authUser.role !== UserRole.MODERATOR &&
                        <div>
                            <button className={classNames('w-full p-2 font-semibold rounded-lg', {
                                'cursor-not-allowed bg-gray-200 text-gray-600': loading,
                                'bg-blue-500 text-white hover:bg-blue-600': !loading
                            })}>
                                {loading ? <LoadingIcon /> : "Cập nhật"}
                            </button>
                        </div>
                    }
                </fieldset>
            </form>
        </AdminLayout >
    )
}