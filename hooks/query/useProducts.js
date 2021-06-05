import { useQuery } from "react-query";
import { getProducts } from "../../lib/db";

export default function useProducts(params) {
    return useQuery(['products', params], () => {
        return getProducts(params)
    }, {
        refetchInterval: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: Infinity
    })
}