import { mongooseConnect } from "../lib/mongoose.js";
import Product             from "../models/Product.js";
import slugify             from "slugify";

async function main() {
  await mongooseConnect();

  // fetch products that have no slug or an empty one
  const products = await Product.find({
    $or: [{ slug: { $exists: false } }, { slug: '' }],
  });

  console.log(`Found ${products.length} products to update…`);

  for (const p of products) {
    let base = slugify(p.title, { lower: true, strict: true });
    let slug = base;
    let i = 1;

    // ensure uniqueness (rare—but two titles could be identical)
    /* eslint-disable no-await-in-loop */
    while (await Product.exists({ _id: { $ne: p._id }, slug })) {
      slug = `${base}-${i++}`;         
    }
    p.slug = slug;
    await p.save();

    console.log(`  ✓ ${p.title}  →  ${p.slug}`);
  }

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
