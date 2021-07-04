import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../auth";
import { addWishlist } from "../../db";

export default function useAddWishlist() {
    const queryClient = useQueryClient()
    const { authUser } = useAuth()
    const uid = authUser?.uid

    return useMutation(
        data => addWishlist(uid, data), {
        onMutate: async () => {
            await queryClient.cancelQueries(['wishlist', uid])
            const previousWishlist = await queryClient.getQueryData(['wishlist', uid])

            return { previousWishlist }
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(['wishlist', uid], [data, ...context.previousWishlist])
        },
        onError: (err, newWishlist, context) => {
            queryClient.setQueryData(['wishlist', uid], context.previousWishlist)
            alert(err?.message ?? err)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['wishlist', uid])
        },
        retry: 3
    })
}