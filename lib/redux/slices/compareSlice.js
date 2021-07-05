import { createSlice } from "@reduxjs/toolkit";
import { store } from 'react-notifications-component'

const initialState = {
    category: null,
    products: []
}

export const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addCompare: (state, action) => {
            const { queryClient, product } = action.payload
            if (state.category === null) {
                state.category = product.category
            }
            if (product.category !== state.category) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Không thể so sánh sản phẩm khác danh mục",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
            } else {
                if (state.products.length === 4) {
                    store.addNotification({
                        title: "Thất bại",
                        message: "Chỉ có thể so sánh cùng lúc tối đa 4 sản phẩm",
                        type: "danger",
                        insert: "top",
                        container: "bottom-right",
                    })
                } else {
                    state.products.push(product.id)
                    const oldData = queryClient.getQueryData('compare')
                    queryClient.setQueryData('compare', [...oldData, product])
                }
            }
        },
        removeCompare: (state, action) => {
            const { queryClient, product } = action.payload

            if (state.products.length === 1) {
                state.category = null
                state.products = []
                queryClient.setQueryData('compare', [])
            } else {
                state.products = state.products.filter(stateProduct => stateProduct !== product.id)
                const oldData = queryClient.getQueryData('compare')
                queryClient.setQueryData('compare', oldData.filter(oldProduct => oldProduct.id !== product.id))
            }
        },
        clearCompare: (state, action) => {
            action.payload.setQueryData('compare', [])
            return initialState
        }
    }
})

export const { addCompare, removeCompare, clearCompare } = compareSlice.actions

export default compareSlice.reducer