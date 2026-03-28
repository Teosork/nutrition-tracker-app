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

export function calculateProductNutrition(product, nutriments) {
    const base = product.nutritionDataPer || 100;
    return nutriments.reduce((acc, { key }) => {
        acc[key] = ((product[key] || 0) * product.grams) / base;
        return acc;
    }, {});
}

export function calculateMealTotals(products, nutriments) {
    const mealTotals = {};
    nutriments.forEach(({ key }) => {
        mealTotals[key] = 0;
        products.forEach(product => {
            mealTotals[key] += product.calculated[key] || 0;
        });
    });
    return mealTotals;
}

export function calculateRemainingTargets(dailyTargets, mealTotals, nutriments) {
    return nutriments.reduce((acc, { key }) => {
        acc[key] = (dailyTargets[key] || 0) - (mealTotals[key] || 0);
        return acc;
    }, {});
}

function updateSummary() {
    const mealTotals = calculateMealTotals(products, nutriments);
    renderTotals(mealTotals, nutriments);

    const remainingTargets = calculateRemainingTargets(dailyTargets, mealTotals, nutriments);
    renderTargets(dailyTargets, remainingTargets, nutriments);
}

async function initializeApp() {
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
    
    for (const product of products) {
        product.calculated = calculateProductNutrition(product, nutriments);
    }
    
    updateSummary();
    renderProducts(products, calculateProductNutrition, updateSummary, nutriments);
}

if (typeof document !== 'undefined') {
    initializeApp();
}