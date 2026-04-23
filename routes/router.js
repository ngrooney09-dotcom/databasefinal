const express = require("express");
const path = require("path");
const db = require("./db"); // <-- change if your connection file name is different

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.get("/", async (req, res) => {
  try {
    const [items] = await db.query("SELECT * FROM purchase_item");

    const [summary] = await db.query(`
      SELECT 
        IFNULL(SUM(cost * quantity), 0) AS total_cost,
        COUNT(*) AS total_items
      FROM purchase_item
    `);

    res.render("index", {
      items,
      total: summary[0].total_cost,
      count: summary[0].total_items
    });

  } catch (err) {
    console.error(err);
    res.send("Error loading page");
  }
});



app.post("/add", async (req, res) => {
  const { name, description, cost, quantity } = req.body;

  try {
    await db.query(
      `INSERT INTO purchase_item 
       (item_name, item_description, cost, quantity) 
       VALUES (?, ?, ?, ?)`,
      [name, description, cost, quantity]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error adding item");
  }
});



app.post("/delete/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM purchase_item WHERE purchase_item_id = ?",
      [req.params.id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error deleting item");
  }
});



app.post("/increase/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE purchase_item SET quantity = quantity + 1 WHERE purchase_item_id = ?",
      [req.params.id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error increasing quantity");
  }
});



app.post("/decrease/:id", async (req, res) => {
  try {
    await db.query(
      `UPDATE purchase_item 
       SET quantity = quantity - 1 
       WHERE purchase_item_id = ? AND quantity > 0`,
      [req.params.id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error decreasing quantity");
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});