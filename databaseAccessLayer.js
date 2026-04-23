const database = include('/databaseConnection');

async function getAllItems() {
let sqlQuery = `
		SELECT 
			purchase_item_id,
			item_name,
			item_description,
			cost,
			quantity
		FROM purchase_item
	`;

```
try {
	const results = await database.query(sqlQuery);
	return results[0];
}
catch (err) {
	console.log("Error selecting from purchase_item table");
	console.log(err);
	return null;
}
```

}

async function addItem(name, description, cost, quantity) {
let sqlQuery = `
		INSERT INTO purchase_item 
		(item_name, item_description, cost, quantity)
		VALUES (?, ?, ?, ?)
	`;

```
try {
	await database.query(sqlQuery, [name, description, cost, quantity]);
}
catch (err) {
	console.log("Error inserting item");
	console.log(err);
}
```

}

async function deleteItem(id) {
let sqlQuery = `
		DELETE FROM purchase_item
		WHERE purchase_item_id = ?
	`;

```
try {
	await database.query(sqlQuery, [id]);
}
catch (err) {
	console.log("Error deleting item");
	console.log(err);
}
```

}

async function increaseQuantity(id) {
let sqlQuery = `
		UPDATE purchase_item
		SET quantity = quantity + 1
		WHERE purchase_item_id = ?
	`;

```
try {
	await database.query(sqlQuery, [id]);
}
catch (err) {
	console.log("Error increasing quantity");
	console.log(err);
}
```

}

async function decreaseQuantity(id) {
let sqlQuery = `
		UPDATE purchase_item
		SET quantity = quantity - 1
		WHERE purchase_item_id = ? AND quantity > 0
	`;

```
try {
	await database.query(sqlQuery, [id]);
}
catch (err) {
	console.log("Error decreasing quantity");
	console.log(err);
}
```

}

async function getSummary() {
let sqlQuery = `
		SELECT 
			IFNULL(SUM(cost * quantity), 0) AS total_cost,
			COUNT(*) AS total_items
		FROM purchase_item
	`;

```
try {
	const results = await database.query(sqlQuery);
	return results[0][0];
}
catch (err) {
	console.log("Error getting summary");
	console.log(err);
	return null;
}
```

}

module.exports = {
getAllItems,
addItem,
deleteItem,
increaseQuantity,
decreaseQuantity,
getSummary
};
