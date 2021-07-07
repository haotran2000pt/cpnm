import { useQuery } from "react-query";
import { getOrders } from "../../lib/db";

export default function useOrders(params) {
    return useQuery(['orders', params], () => {
        return getOrders(params)
    }, {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        retry: Infinity,
        refetchOnMount: true,
        staleTime: 100000,
    })
}