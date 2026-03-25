import { barcodes, dailyTargets, nutriments } from "./data.js";
import { fetchProductWithRetry } from "./api.js";
import { renderProducts, renderMissingProducts, renderTotals, renderTargets } from "./ui.js";

const products = [];
const failedBarcodes = [];

function extractProductData(productData) {
    return {
        name: productData.product?.product_name,
        ...nutriments.reduce((acc, { key, apiKey }) => {
            acc[key] = productData.product?.nutriments?.[apiKey];
            return acc;
        }, {}),
        nutritionDataPer: parseInt(productData.product?.nutrition_data_per || "100"),
        grams: 0
    };
}

for (const barcode of barcodes) {
    try {
        const productData = await fetchProductWithRetry(barcode);
        const product = extractProductData(productData);
        products.push(product);
    } catch (error) {
        failedBarcodes.push(barcode);
        if (error.status === 404) {
            console.warn(`Barcode not found: ${barcode}`);
        } else {
            console.error(`Failed to fetch ${barcode}: ${error.message}`);
        }
    }
}
renderMissingProducts(failedBarcodes);

function calculateProductNutrition(product) {
    const base = product.nutritionDataPer || 100;
    product.calculated = nutriments.reduce((acc, { key }) => {
        acc[key] = ((product[key] || 0) * product.grams) / base;
        return acc;
    }, {})
}

for (const product of products) {
    calculateProductNutrition(product);
}
const mealTotals = nutriments.reduce((acc, { key }) => {
    acc[key] = 0;
    return acc;
}, {})


function calculateMealTotals(products, mealTotals) {
    nutriments.forEach(({ key }) => {
        mealTotals[key] = 0;
    });

    for (const product of products) {
        nutriments.forEach(({ key }) => {
            mealTotals[key] += product.calculated[key] || 0;
        });
    }
}

const remainingTargets = nutriments.reduce((acc, { key }) => {
    acc[key] = 0;
    return acc;
}, {})

function calculateRemainingTargets(dailyTargets, mealTotals, remainingTargets) {
    nutriments.forEach(({key}) => {
           remainingTargets[key] = dailyTargets[key] - mealTotals[key];
    });
}

function updateSummary() {
    calculateMealTotals(products, mealTotals);
    renderTotals(mealTotals, nutriments);
    calculateRemainingTargets(dailyTargets, mealTotals, remainingTargets);
    renderTargets(dailyTargets, remainingTargets, nutriments);
}

updateSummary();
renderProducts(products, calculateProductNutrition, updateSummary, nutriments);