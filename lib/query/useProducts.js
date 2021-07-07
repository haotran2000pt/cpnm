import { useQuery } from "react-query";
import { getProducts } from "../db";

export default function useProducts(params) {
    return useQuery(['products', params ?? []], () => {
        return getProducts(params ?? [])
    }, {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        retry: Infinity,
        refetchOnMount: true,
        staleTime: 100000,
    })
}