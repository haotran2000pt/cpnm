import { useQuery } from "react-query";
import { getOrders } from "../../lib/db";

export default function useOrders(params) {
    return useQuery(['products', params], () => {
        return getOrders(params)
    }, {
        refetchInterval: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: Infinity
    })
}