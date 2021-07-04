import { useQuery } from "react-query";
import { useAuth } from "../../auth";
import { getWishlist } from "../../db";

export default function useWishlist() {
    const { authUser } = useAuth()

    return useQuery(['wishlist', authUser?.uid], () => getWishlist(authUser?.uid), {
        retry: Infinity,
        staleTime: 10000
    })
}