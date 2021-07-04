import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../auth";
import { addWishlist, removeWishlist } from "../../db";

export default function useRemoveWishlist() {
    const queryClient = useQueryClient()
    const { authUser } = useAuth()
    const uid = authUser?.uid

    return useMutation(
        data => removeWishlist(uid, data), {
        onMutate: async () => {
            await queryClient.cancelQueries(['wishlist', uid])
            const previousWishlist = queryClient.getQueryData(['wishlist', uid])

            return { previousWishlist }
        },
        onSuccess: (data, variables, context) => {
            const oldWishlist = context.previousWishlist
            const newWishlist = oldWishlist.filter(product => product.id !== data.id)
            queryClient.setQueryData(['wishlist', uid], newWishlist)
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