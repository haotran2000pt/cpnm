import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../db";
import firebase from '../firebase'
import { clearCompare } from "../redux/slices/compareSlice";

export default function useCompare() {
    const products = useSelector(state => state.compare.products)
    const dispatch = useDispatch()
    const query = useQuery('compare', async () => {
        try {
            const productsData = await getProducts({
                where: [{
                    field: firebase.firestore.FieldPath.documentId(),
                    op: "in",
                    value: products
                }]
            })
            return productsData
        } catch (e) {
            dispatch(clearCompare())
        }
    }, {
        initialData: [],
        placeholderData: [],
        staleTime: 100000,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    })



    return query
}