import { dailyTargets, nutriments } from "./data.js";
import { fetchProductWithRetry } from "./api.js";
import { renderProducts, renderTotals, renderTargets } from "./ui.js";

const products = [];

function extractProductData(productData, barcode) {
    return {
        id: crypto.randomUUID(),
        barcode,
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
    refreshProductsUI();
}

if (typeof document !== 'undefined') {
    initializeApp();
}

function renderAllProducts() {
    renderProducts(products, calculateProductNutrition, updateSummary, nutriments, handleDeleteProduct);
}

function setBarcodeFeedback(message) {
    const feedback = document.getElementById("barcode-feedback");
    if (!feedback) return;
    feedback.textContent = message || "";
}

const barcodeForm = document.getElementById("barcode-form");
const barcodeInput = document.getElementById("barcode-input");

function setAddingState(isLoading) {
    const submitButton = barcodeForm?.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = isLoading;
    if (barcodeInput) barcodeInput.disabled = isLoading;

    if (isLoading) {
        setBarcodeFeedback("Searching...");
    }
}

const pendingBarcodes = new Set();

async function addProductByBarcode(rawBarcode) {
    const barcode = rawBarcode.trim();

    if (products.some((p) => p.barcode === barcode)) {
        return { ok: false, error: { code: "DUPLICATE" } };
    }

    if (pendingBarcodes.has(barcode)) {
        return { ok: false, error: { code: "PENDING" } };
    }

    pendingBarcodes.add(barcode);
    try {
        const productData = await fetchProductWithRetry(barcode);
        const product = extractProductData(productData, barcode);
        products.push(product);
        refreshProductsUI();
        return { ok: true };
    } catch (error) {
        return { ok: false, error };
    } finally {
        pendingBarcodes.delete(barcode);
    }
}

if (barcodeForm && barcodeInput) {
    barcodeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const barcode = barcodeInput.value.trim();
        if (!barcode) {
            setBarcodeFeedback("Please enter a barcode.");
            return;
        }

        setAddingState(true);
        try {
            const result = await addProductByBarcode(barcode);

            if (!result.ok) {
                if (result.error?.code === "DUPLICATE") {
                    setBarcodeFeedback("This product is already in your list.");
                } else if (result.error?.code === "PENDING") {
                    setBarcodeFeedback("This barcode is already being added.");
                } else if (result.error?.status === 404) {
                    setBarcodeFeedback("Product not found for this barcode.");
                } else {
                    setBarcodeFeedback("Could not fetch product right now. Try again.");
                }
                return;
            }

            barcodeInput.value = "";
            setBarcodeFeedback("Product added.");
        } finally {
            setAddingState(false);
        }
    });
}

function handleDeleteProduct(productId) {
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return;

    products.splice(index, 1);
    refreshProductsUI();
}

function refreshProductsUI() {
    for (const product of products) {
        product.calculated = calculateProductNutrition(product, nutriments);
    }
    updateSummary();
    renderAllProducts();
}