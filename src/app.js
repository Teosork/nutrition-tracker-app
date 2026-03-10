import {barcodes, dailyTargets} from "./data.js";
import { fetchProduct } from "./api.js";

console.log("Barcodes:", barcodes);
console.log("Daily Targets:", dailyTargets);

const productData = await fetchProduct(barcodes[0]);
console.log("Nutriments:", productData.product.nutriments);
console.log("Product Name:", productData.product.product_name);
console.log("Kcal per 100g:", productData.product.nutriments["energy-kcal_100g"]);
console.log("Fat per 100g:", productData.product.nutriments.fat_100g);
console.log("Carbs per 100g:", productData.product.nutriments.carbohydrates_100g);
console.log("Protein per 100g:", productData.product.nutriments.proteins_100g);