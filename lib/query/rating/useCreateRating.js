import axios from "axios";
import { useMutation } from "react-query";
import { store } from 'react-notifications-component'

export default function useCreateRating() {
    return useMutation(async (data) => {
        return axios.post('/api/ratings', data)
    }, {
        onSuccess: () => {
            store.addNotification({
                title: "Thành công",
                message: "Đánh giá sản phẩm thành công",
                type: "success",
                insert: "top",
                container: "bottom-right",
            })
        },
        onError: (e) => {
            console.log(e)
            store.addNotification({
                title: "Thất bại",
                message: e?.response?.data?.message ?? "Đánh giá sản phẩm thất bại",
                type: "danger",
                insert: "top",
                container: "bottom-right",
            })
        }
    })
}