import { useMutation } from "react-query";
import { useAuth } from "../auth";
import { updateUser } from "../db";
import { store } from 'react-notifications-component';

export default function useUpdateAccount() {
    const { authUser, setAuthUser } = useAuth()
    return useMutation(data => updateUser(authUser.uid, data), {
        onSuccess: (data, variables) => {
            setAuthUser({
                ...authUser,
                ...variables
            })
            store.addNotification({
                title: "Thành công",
                message: "Cập nhật tài khoản thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        },
        onError: err => {
            store.addNotification({
                title: "Thất bại",
                message: "Không thể cập nhật tài khoản\n" + err?.message || err,
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
    })
}