import axios from "axios";
import { useQuery } from "react-query";

export default function useUsers() {
    return useQuery('users', async () => {
        const users = await axios.get('/api/users')
        return users.data
    }, {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        retry: Infinity
    })
}