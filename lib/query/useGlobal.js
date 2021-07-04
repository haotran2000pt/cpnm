import { useQuery } from "react-query";
import { getGlobalData } from "../db";

export default function useGlobal() {
    return useQuery('global', getGlobalData)
}