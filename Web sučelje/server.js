const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use("/data", express.static("data"));

app.get("/api/podaci", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("data/Products.json", "utf8")
  );
  const brands = JSON.parse(
    fs.readFileSync("data/brands.json", "utf8")
  );
  const categories = JSON.parse(
    fs.readFileSync("data/categories.json", "utf8")
  );

  // mapiranje ID -> name
  const brandMap = {};
  brands.forEach(b => brandMap[b.ID] = b.name);

  const categoryMap = {};
  categories.forEach(c => categoryMap[c.ID] = c.name);

  // obogaćeni proizvodi
  let result = products.map(p => ({
    id: p.ID,
    name: p.name,
    brand: brandMap[p.brandID],
    category: categoryMap[p.catID],
    price: p.price,
    features: p.features.join(", ")
  }));

    const q = req.query.q?.toLowerCase();
  const field = req.query.field;

  if (q && q.trim() !== "") {
    result = result.filter(p => {
      if (!field) {
        return Object.values(p).some(v =>
          v.toString().toLowerCase().includes(q)
        );
      }
      return p[field]
        .toString()
        .toLowerCase()
        .includes(q);
    });
  }

  res.json(result);
});

app.get("/api/download/:format", (req, res) => {
  const format = req.params.format;
  if (format === "json") {
    res.download("data/podaci.json");
  }
  if (format === "csv") {
    res.download("data/podaci.csv");
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
