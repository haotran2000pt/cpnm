import { createContext, useContext, useEffect, useState } from 'react';

const cartContext = createContext({
    items: null,
    append: () => { },
    remove: () => { },
    increase: () => { },
    decrease: () => { },
    clear: () => { }
})

const useProvideCart = () => {
    const [items, setItems] = useState([])

    const append = (product) => {
        let isUpdate = false
        let newItems = items.map(item => {
            if (item.product.id !== product.id)
                return item
            else {
                isUpdate = true
                return {
                    product,
                    quantity: item.quantity + 1,
                }
            }
        })
        if (!isUpdate) {
            newItems = [...items, {
                product,
                quantity: 1
            }]
        }
        setItems(newItems)
        localStorage.setItem('cart', JSON.stringify(newItems))
    }

    const increase = (product) => {
        let newItems = items.map(item => {
            if (item.product.id !== product.id)
                return item
            else {
                return {
                    product,
                    quantity: item.quantity + 1,
                }
            }
        })
        setItems(newItems)
        localStorage.setItem('cart', JSON.stringify(newItems))

    }

    const decrease = (product) => {
        let newItems = items.map(item => {
            if (item.product.id !== product.id)
                return item
            else {
                if (item.quantity === 1) {
                    return item
                }
                return {
                    product,
                    quantity: item.quantity - 1,
                }
            }
        })
        setItems(newItems)
        localStorage.setItem('cart', JSON.stringify(newItems))
    }

    const remove = (id) => {
        const newItems = items.filter(item => item.product.id !== id)
        setItems(newItems)
        localStorage.setItem('cart', JSON.stringify(newItems))
    }

    const clear = () => {
        setItems([])
        localStorage.setItem('cart', [])
    }

    useEffect(() => {
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', [])
        } else {
            const cart = JSON.parse(localStorage.getItem('cart'))
            setItems(cart)
        }
    }, [])

    return {
        items,
        append,
        remove,
        increase,
        decrease,
        clear,
    }
}

export function CartProvider({ children }) {
    const cart = useProvideCart()
    return <cartContext.Provider value={cart}>{children}</cartContext.Provider>
}

export const useCart = () => useContext(cartContext)