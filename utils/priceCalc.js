export function calcSingleItemPrice(product) {
    return product.price - Math.floor(product.price * product.discount / 100)
}

export function calcListItemPrice(list) {
    return list.reduce((acc, cur) => {
        return acc + cur.quantity * calcSingleItemPrice(cur.product)
    }, 0)
}