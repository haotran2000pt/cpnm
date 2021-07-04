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
            if (state.category === null) {
                state.category = action.payload.category
            } else {
                if (action.payload.category !== state.category) {
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
                        state.products.push(action.payload.id)
                    }
                }
            }
        },
        removeCompare: (state, action) => {
            if (state.products.length === 1) {
                state.category = null
                state.products = []
            } else {
                state.products = state.products.filter(product => product !== action.payload.id)
            }
        },
        clearCompare: () => {
            return initialState
        }
    }
})

export const { addCompare, removeCompare, clearCompare } = compareSlice.actions

export default compareSlice.reducer