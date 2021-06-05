function moveItem(array, from, to) {
    const tmpArr = array.slice(0)
    var f = tmpArr.splice(from, 1)[0];
    tmpArr.splice(to, 0, f);
    return tmpArr
}

export default moveItem