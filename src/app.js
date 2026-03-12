import {barcodes, dailyTargets} from "./data.js";
import { fetchProduct } from "./api.js";

console.log("Barcodes:", barcodes);
console.log("Daily Targets:", dailyTargets);

const  products = [];

function extractProductData(productData) {
    return {
        name: productData.product?.product_name,
        kcal: productData.product?.nutriments?.["energy-kcal_100g"],
        fat: productData.product?.nutriments?.fat_100g,
        carbs: productData.product?.nutriments?.carbohydrates_100g,
        protein: productData.product?.nutriments?.proteins_100g,
    };
}

for (const barcode of barcodes){
    console.log(barcode);
    try {
    const productData = await fetchProduct(barcode);
    const product = extractProductData(productData);
    products.push(product);
    } catch (error){
    console.error('An error occurred while fetching data: ', error.message);    
    }
}
console.log(products);