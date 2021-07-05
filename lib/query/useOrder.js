import { useQuery } from "react-query";
import { getOrder } from "../../lib/db";

export default function useOrder(id) {
    return useQuery(['order', id], async () => {
        if (_.isEmpty(id)) {
            return null
        }
        return await getOrder(id)
    }, {
        refetchInterval: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: Infinity
    })
}