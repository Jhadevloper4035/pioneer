const mongoose = require("mongoose");
const connectDb = require("../config/db");
const LouverProduct = require("../models/LouverProduct");
const products = require("../data/louverProductsSeed");
const slugify = require("../utils/slugify");

async function seedLouverProducts() {
  await connectDb();

  for (const product of products) {
    await LouverProduct.findOneAndUpdate(
      { productId: product.id },
      {
        productId: product.id,
        name: product.name,
        slug: slugify(product.name),
        image: product.image,
        specifications: product.specifications,
        active: true,
        order: product.id
      },
      { returnDocument: "after", upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${products.length} louver products`);
}

seedLouverProducts()
  .catch((error) => {
    console.error("Failed to seed louver products", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
