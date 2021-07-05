export function calcSingleItemPrice(product) {
    return product.price - product.discount
}

export function calcListItemPrice(list) {
    console.log(list)
    return list.reduce((acc, cur) => {
        return acc + cur.quantity * calcSingleItemPrice(cur.product)
    }, 0)
}