const { BadRequestError } = require("../expressError");

/*
sqlForPartialUpdate takes in two objects and generates an object that can be used in SQL queries

The first @param dataToUpdate is an object that contains the key value pairs of the data that needs to be updated
The second @param jsToSql is another object that contains the keys as JS object keys and the values as the SQL database column names

The function returns an object with the first key, setCols: containing the parametrized query and the values contain the values
        const obj1 = { firstName: "John", lastName: "Doe"}
        const obj2 = { firstName: "first_name", lastName: "last_name"}
        sqlForPartialUpdate(obj1, obj2) // Returns:
          {
              setCols: `"first_name"=$1, "last_name"=$2`,
              values: ["John", "Doe"]
          }
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
