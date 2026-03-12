import {barcodes, dailyTargets} from "./data.js";
import { fetchProduct } from "./api.js";

console.log("Barcodes:", barcodes);
console.log("Daily Targets:", dailyTargets);

const products = [];

function extractProductData(productData) {
    return {
        name: productData.product?.product_name,
        kcal: productData.product?.nutriments?.["energy-kcal_100g"],
        fat: productData.product?.nutriments?.fat_100g,
        carbs: productData.product?.nutriments?.carbohydrates_100g,
        protein: productData.product?.nutriments?.proteins_100g,
        nutritionDataPer: productData.product?.nutrition_data_per,
        servingSize: productData.product?.serving_size,
        servingQuantity: productData.product?.serving_quantity,
        grams: 0
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

for (const product of products) {
    product.calculatedKcal = ((product.kcal || 0) * product.grams) / 100;
    product.calculatedFat = ((product.fat || 0) * product.grams) / 100;
    product.calculatedCarbs = ((product.carbs || 0) * product.grams) / 100;
    product.calculatedProtein = ((product.protein || 0) * product.grams) / 100;
}

console.log(products);

const mealTotals = {
    kcal: 0,
    fat: 0,
    carbs: 0,
    protein: 0
}

for (const product of products){
    mealTotals.kcal += product.calculatedKcal || 0;
    mealTotals.fat += product.calculatedFat || 0;
    mealTotals.carbs += product.calculatedCarbs || 0;
    mealTotals.protein += product.calculatedProtein || 0;
}
console.log(mealTotals);

const remainingTargets = {
    kcal: dailyTargets.kcal - mealTotals.kcal,
    fat: dailyTargets.fat - mealTotals.fat,
    carbs: dailyTargets.carbs - mealTotals.carbs,
    protein: dailyTargets.protein - mealTotals.protein
}
console.log(remainingTargets);
