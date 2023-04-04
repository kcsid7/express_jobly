const { sqlForPartialUpdate } = require("./sql.js");

describe("Testing sqlForPartialUpdate()", function() {
    test("generate query 1", function() {
        const obj1 = { obj1key1: "obj1val1", obj1key2: "obj1val2"}
        const obj2 = { obj2key1: "obj2val1"}
        const data = sqlForPartialUpdate(obj1, obj2);
        expect(data).toEqual({
            setCols: `"obj1key1"=$1, "obj1key2"=$2`,
            values: ["obj1val1", "obj1val2"]
        })
    })

    test("generate query 1", function() {
        const obj1 = { firstName: "John", lastName: "Doe"}
        const obj2 = { firstName: "first_name", lastName: "last_name"}
        const data = sqlForPartialUpdate(obj1, obj2);
        expect(data).toEqual({
            setCols: `"first_name"=$1, "last_name"=$2`,
            values: ["John", "Doe"]
        })
    })
})