import "dotenv/config";
import { Pool } from "pg";
import { productsList } from "./productsList";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Start populating database...");

    // Check existing products
    const existingResult = await pool.query(
      'SELECT "stripePriceId" FROM "Product"'
    );
    const existingPriceIds = new Set(
      existingResult.rows.map((row) => row.stripePriceId)
    );

    console.log(`Found ${existingResult.rows.length} existing products`);

    // Create only products that don't exist
    let createdCount = 0;
    let skippedCount = 0;

    for (const product of productsList) {
      if (existingPriceIds.has(product.stripePriceId)) {
        console.log(`⊘ Skipping existing product: ${product.name}`);
        skippedCount++;
        continue;
      }

      await pool.query(
        `INSERT INTO "Product" (
          "id", "name", "description", "price", "image", 
          "stripePriceId", "isFeatured", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          crypto.randomUUID(),
          product.name,
          product.description,
          product.price,
          product.image,
          product.stripePriceId,
          product.isFeatured,
          product.createdAt,
          product.updatedAt,
        ]
      );

      console.log(`✓ Created product: ${product.name}`);
      createdCount++;
    }

    console.log("\n✅ Database population finished!");
    console.log(`   Created: ${createdCount} products`);
    console.log(`   Skipped: ${skippedCount} products`);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
