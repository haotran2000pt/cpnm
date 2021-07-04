import { useQuery } from "react-query";
import { getOrders } from "../../lib/db";

export default function useOrders() {
    return useQuery(['products'], () => {
        return getOrders()
    }, {
        refetchInterval: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: Infinity
    })
}