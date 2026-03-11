import {barcodes, dailyTargets} from "./data.js";
import { fetchProduct } from "./api.js";

console.log("Barcodes:", barcodes);
console.log("Daily Targets:", dailyTargets);

const productData = await fetchProduct(barcodes[0]);

function extractProductData(productData) {
    return {
        name: productData.product?.product_name,
        kcal: productData.product?.nutriments?.["energy-kcal_100g"],
        fat: productData.product?.nutriments?.fat_100g,
        carbs: productData.product?.nutriments?.carbohydrates_100g,
        protein: productData.product?.nutriments?.proteins_100g,
    };
}

const product = extractProductData(productData);
console.log(product);