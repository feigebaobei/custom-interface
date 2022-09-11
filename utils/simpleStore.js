let createSimpleStore = () => {
    let simpleStore = {
        value: new Set(),
        isExist: function (v) {
            return simpleStore.value.has(v)
        },
        add: function(v) {
            simpleStore.value.add(v)
        },
        remove: function (v) {
            simpleStore.value.delete(v)
        }
    }
    return simpleStore
}
// export default createSimpleStore
module.exports = {
    createSimpleStore
}