import firebase from '../lib/firebase'
import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '../lib/auth';
import { getProducts } from '../lib/db';
import { store } from 'react-notifications-component'
import _ from 'lodash';

const cartContext = createContext({
    items: null,
    append: async () => { },
    remove: async () => { },
    increase: async () => { },
    decrease: async () => { },
    clear: async () => { },
    refetch: async () => { },
    isLoading: false,
    isFetching: false,
    mutateLoading: false
})

const useProvideCart = () => {
    const [initialized, setInitialize] = useState(false)
    const [items, setItems] = useState([])
    const queryClient = useQueryClient()
    const { authUser } = useAuth()
    const cartMutation = useMutation(async (data) => {
        await firebase.firestore().collection('carts').doc(authUser.uid).set(data)
    })

    const { data, isLoading, isFetching, refetch } = useQuery("cart", async () => {
        if (_.isEmpty(items)) {
            return []
        }
        const data = await getProducts({
            where: [{
                field: firebase.firestore.FieldPath.documentId(),
                op: "in",
                value: items.map(item => item.id)
            }]
        })
        if (!initialized) {
            setInitialize(true)
        }
        return data
    }, {
        keepPreviousData: true,
        staleTime: 1000000,
        enabled: initialized,
        placeholderData: [],
        initialData: []
    })

    const append = async (product) => {
        if (cartMutation.isLoading) {
            return
        }
        let isUpdate = false

        let newItems = await Promise.all(items.map(async (item) => {
            if (item.id !== product.id)
                return item
            else {
                isUpdate = true
                if (item.quantity >= product.quantity) {
                    store.addNotification({
                        title: "Thất bại",
                        message: "Số lượng đặt hàng vượt quá kho hàng!",
                        type: "danger",
                        insert: "top",
                        container: "bottom-right",
                    })
                    return item
                }
                store.addNotification({
                    title: "Thành công",
                    message: "Sản phẩm đã được thêm vào giỏ hàng",
                    type: "success",
                    insert: "top",
                    container: "bottom-right",
                    dismiss: {
                        duration: 2500,
                        onScreen: true
                    }
                })
                return {
                    id: item.id,
                    quantity: item.quantity + 1,
                }
            }
        }))

        if (!isUpdate) {
            store.addNotification({
                title: "Thành công",
                message: "Sản phẩm đã được thêm vào giỏ hàng",
                type: "success",
                insert: "top",
                container: "bottom-right",
                dismiss: {
                    duration: 2500,
                    onScreen: true
                }
            })
            newItems = [...items, {
                id: product.id,
                quantity: 1
            }]
            const cache = queryClient.getQueryData('cart')
            queryClient.setQueryData('cart', [...cache, product])
        }

        if (!authUser) {
            localStorage.setItem('cart', JSON.stringify(newItems))
        } else {
            try {
                await cartMutation.mutateAsync({
                    cart: newItems,
                    updated_at: Date.now()
                })
            } catch (e) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Lỗi máy chủ!",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
                return
            }
        }
        setItems(newItems)
    }

    const increase = async (product) => {
        if (cartMutation.isLoading) {
            return
        }
        let newItems = await Promise.all(items.map(async (item) => {
            if (item.id !== product.id)
                return item
            else {
                if (item.quantity >= product.quantity) {
                    store.addNotification({
                        title: "Thất bại",
                        message: "Số lượng đặt hàng vượt quá kho hàng!",
                        type: "danger",
                        insert: "top",
                        container: "bottom-right",
                    })
                    return item
                }
                return {
                    id: item.id,
                    quantity: item.quantity + 1,
                }
            }
        }))
        if (!authUser) {
            localStorage.setItem('cart', JSON.stringify(newItems))
        } else {
            try {
                console.log(newItems)
                await cartMutation.mutateAsync({
                    cart: newItems,
                    updated_at: Date.now()
                })
            } catch (e) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Lỗi máy chủ!",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
                return
            }
        }
        setItems(newItems)
    }

    const decrease = async (product) => {
        if (cartMutation.isLoading) {
            return
        }
        let newItems = await Promise.all(items.map(async (item) => {
            if (item.id !== product.id)
                return item
            else {
                if (item.quantity === 1) {
                    return item
                }
                return {
                    id: item.id,
                    quantity: item.quantity - 1,
                }
            }
        }))
        if (!authUser) {
            localStorage.setItem('cart', JSON.stringify(newItems))
        } else {
            try {
                await cartMutation.mutateAsync({
                    cart: newItems,
                    updated_at: Date.now()
                })
            } catch (e) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Lỗi máy chủ!",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
                return
            }
        }
        setItems(newItems)
    }

    const remove = async (id) => {
        if (cartMutation.isLoading) {
            return
        }
        const newItems = items.filter(item => item.id !== id)
        const cache = queryClient.getQueryData('cart')
        if (!authUser) {
            localStorage.setItem('cart', JSON.stringify(newItems))
        } else {
            try {
                await cartMutation.mutateAsync({
                    cart: newItems,
                    updated_at: Date.now()
                })
            } catch (e) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Lỗi máy chủ!",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
                return
            }
        }
        queryClient.setQueryData('cart', cache.filter(product => product.id !== id))
        setItems(newItems)
    }

    const clear = async () => {
        if (authUser) {
            try {
                await cartMutation.mutateAsync({
                    cart: [],
                    updated_at: Date.now()
                })
            } catch (e) {
                store.addNotification({
                    title: "Thất bại",
                    message: "Lỗi máy chủ!",
                    type: "danger",
                    insert: "top",
                    container: "bottom-right",
                })
                return
            }
        }
        setItems([])
        queryClient.setQueryData('cart', [])
        localStorage.setItem('cart', JSON.stringify([]))
    }

    useEffect(() => {
        (async () => {
            if (!authUser) {
                if (!localStorage.getItem('cart')) {
                    localStorage.setItem('cart', JSON.stringify([]))
                }
                const cart = JSON.parse(localStorage.getItem('cart'))
                setItems(cart)
            } else {
                const dbCart = queryClient.getQueryData('cartItem') ?? []
                const localCart = JSON.parse(localStorage.getItem('cart'))
                if (!_.isEmpty(localCart)) {
                    let newCart = _.keyBy(dbCart, 'id')
                    localCart.forEach(item => {
                        newCart[item.id] = { quantity: item.quantity }
                    })

                    newCart = _.map(newCart, (v, id) => ({ id, ...v }))
                    try {
                        await cartMutation.mutateAsync({
                            cart: newCart,
                            updated_at: Date.now()
                        })
                    } catch (e) {
                        store.addNotification({
                            title: "Thất bại",
                            message: "Lỗi máy chủ!",
                            type: "danger",
                            insert: "top",
                            container: "bottom-right",
                        })
                        return
                    }
                    localStorage.setItem('cart', JSON.stringify([]))
                    setItems(newCart)
                } else {
                    setItems(dbCart)
                }
            }
            setInitialize(true)
            await queryClient.invalidateQueries('cart')
            await refetch()
        })()
    }, [authUser])

    return {
        items: items.map(item => {
            const product = data.find(product => product.id === item.id)
            return { ...item, product }
        }),
        isFetching,
        isLoading: isLoading || !initialized || (items.length !== data.length),
        mutateLoading: cartMutation.isLoading,
        append,
        remove,
        increase,
        decrease,
        clear,
        refetch
    }
}

export function CartProvider({ children }) {
    const cart = useProvideCart()
    return <cartContext.Provider value={cart}>{children}</cartContext.Provider>
}

export const useCart = () => useContext(cartContext)