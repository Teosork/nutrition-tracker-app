import { barcodes, dailyTargets } from "./data.js";
import { fetchProduct } from "./api.js";
import { renderProducts, renderMissingProducts, renderTotals, renderTargets} from "./ui.js";

const products = [];
const failedBarcodes = [];

function extractProductData(productData) {
    return {
        name: productData.product?.product_name,
        kcal: productData.product?.nutriments?.["energy-kcal_100g"],
        fat: productData.product?.nutriments?.fat_100g,
        carbs: productData.product?.nutriments?.carbohydrates_100g,
        protein: productData.product?.nutriments?.proteins_100g,
        nutritionDataPer: parseInt(productData.product?.nutrition_data_per || "100"),
        grams: 0
    };
}

for (const barcode of barcodes){
    try {
    const productData = await fetchProduct(barcode);
    const product = extractProductData(productData);
    products.push(product);
    } catch (error){
    failedBarcodes.push(barcode);
    console.error('An error occurred while fetching data: ', error.message);    
    }
}
renderMissingProducts(failedBarcodes);

function calculateProductNutrition(product) {
    const base = product.nutritionDataPer || 100;
    product.calculatedKcal = ((product.kcal || 0) * product.grams) / base;
    product.calculatedFat = ((product.fat || 0) * product.grams) / base;
    product.calculatedCarbs = ((product.carbs || 0) * product.grams) / base;
    product.calculatedProtein = ((product.protein || 0) * product.grams) / base;
}

for (const product of products) {
    calculateProductNutrition(product);
}

const mealTotals = {
    kcal: 0,
    fat: 0,
    carbs: 0,
    protein: 0
};

function calculateMealTotals(products, mealTotals) {
    mealTotals.kcal = 0;
    mealTotals.fat = 0;
    mealTotals.carbs = 0;
    mealTotals.protein = 0;

    for (const product of products) {
        mealTotals.kcal += product.calculatedKcal || 0;
        mealTotals.fat += product.calculatedFat || 0;
        mealTotals.carbs += product.calculatedCarbs || 0;
        mealTotals.protein += product.calculatedProtein || 0;
    }
}

const remainingTargets = {
    kcal: 0,
    fat: 0,
    carbs: 0,
    protein: 0
};

function calculateRemainingTargets(dailyTargets, mealTotals, remainingTargets) {
    remainingTargets.kcal = dailyTargets.kcal - mealTotals.kcal;
    remainingTargets.fat = dailyTargets.fat - mealTotals.fat;
    remainingTargets.carbs = dailyTargets.carbs - mealTotals.carbs;
    remainingTargets.protein = dailyTargets.protein - mealTotals.protein;
}

function updateSummary() {
    calculateMealTotals(products, mealTotals);
    renderTotals(mealTotals);
    calculateRemainingTargets(dailyTargets, mealTotals, remainingTargets);
    renderTargets(dailyTargets, remainingTargets);
}

updateSummary();
renderProducts(products, calculateProductNutrition, updateSummary);