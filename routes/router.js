const router = require('express').Router();
const database = include('databaseConnection');

router.get('/', async (req, res) => {
try {
const [items] = await database.query("SELECT * FROM purchase_item");


const [summary] = await database.query(`
  SELECT 
    IFNULL(SUM(cost * quantity), 0) AS total_cost,
    COUNT(*) AS total_items
  FROM purchase_item
`);

res.render('index', {
  items,
  total: summary[0].total_cost,
  count: summary[0].total_items
});


} catch (err) {
console.log(err);
res.send("Error loading page");
}
});

router.post('/add', async (req, res) => {
const { name, description, cost, quantity } = req.body;

try {
await database.query(
`INSERT INTO purchase_item 
       (item_name, item_description, cost, quantity) 
       VALUES (?, ?, ?, ?)`,
[name, description, cost, quantity]
);


res.redirect("/");


} catch (err) {
console.log(err);
res.send("Error adding item");
}
});

router.post('/delete/:id', async (req, res) => {
try {
await database.query(
"DELETE FROM purchase_item WHERE purchase_item_id = ?",
[req.params.id]
);


res.redirect("/");


} catch (err) {
console.log(err);
res.send("Error deleting item");
}
});

router.post('/increase/:id', async (req, res) => {
try {
await database.query(
"UPDATE purchase_item SET quantity = quantity + 1 WHERE purchase_item_id = ?",
[req.params.id]
);


res.redirect("/");


} catch (err) {
console.log(err);
res.send("Error increasing quantity");
}
});

router.post('/decrease/:id', async (req, res) => {
try {
await database.query(
`UPDATE purchase_item 
       SET quantity = quantity - 1 
       WHERE purchase_item_id = ? AND quantity > 0`,
[req.params.id]
);


res.redirect("/");


} catch (err) {
console.log(err);
res.send("Error decreasing quantity");
}
});

module.exports = router;
