const assert = require("node:assert/strict");
const { getLouverProducts } = require("../src/services/louverService");

(async () => {
  const products = await getLouverProducts();
  const expected = {
    "24-mm": [162, 24, 2900, 4],
    "16mm-zigzag": [180, 16, 2900, "Zigzag"]
  };

  for (const [slug, [width_mm, height_mm, length_mm, no_of_flutes]] of Object.entries(expected)) {
    const product = products.find((item) => item.slug === slug);
    assert.deepEqual(product.specifications, { width_mm, height_mm, length_mm, no_of_flutes });
    assert.equal(product.serialNumber, slug === "24-mm" ? 1 : 11);
    assert.match(product.productInformation.map((item) => `${item.label}: ${item.value}`).join("\n"), /Width:|No\. of flutes:/);
  }

  assert.equal(products.length, 11);
  console.log("Louver specifications check passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
