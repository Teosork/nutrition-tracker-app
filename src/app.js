import { dailyTargets, nutriments } from "./data.js";
import { fetchProductWithRetry } from "./api.js";
import { renderProducts, renderTotals, renderTargets } from "./ui.js";

const products = [];

function extractProductData(productData, barcode) {
    const { basisAmount, basisUnit } = parseBasis(productData.product?.nutrition_data_per);
    const { servingAmount, servingUnit } = parseServingSize(productData.product?.serving_size);

    const per100 = nutriments.reduce((acc, { key, keyPer100 }) => {
        acc[key] = productData.product?.nutriments?.[keyPer100] ?? null;
        return acc;
    }, {});

    const perServing = nutriments.reduce((acc, { key, keyPerServing }) => {
        acc[key] = productData.product?.nutriments?.[keyPerServing] ?? null;
        return acc;
    }, {});

    return {
        id: crypto.randomUUID(),
        barcode,
        name: productData.product?.product_name || `Unknown product (${barcode})`,
        basisAmount,
        basisUnit,
        servingSize: productData.product?.serving_size || null,
        servingAmount,
        servingUnit,
        per100,
        perServing,
        inputAmount: null,
        inputUnit: null,
        calculated: null
    };
}

function parseBasis(raw) {
    const match = (raw || "").match(/(\d+\.?\d*)\s*(g|ml)/i);
    return {
        basisAmount: match ? parseFloat(match[1]) : 100,
        basisUnit:   match ? match[2].toLowerCase() : "g"
    };
}

function parseServingSize(raw) {
    if (!raw) return { servingAmount: null, servingUnit: null };
    const parenMatch = raw.match(/\((\d+\.?\d*)\s*(g|ml)\)/i);
    if (parenMatch) return { servingAmount: parseFloat(parenMatch[1]), servingUnit: parenMatch[2].toLowerCase() };
    const directMatch = raw.match(/^(\d+\.?\d*)\s*(g|ml)/i);
    if (directMatch) return { servingAmount: parseFloat(directMatch[1]), servingUnit: directMatch[2].toLowerCase() };
    return { servingAmount: null, servingUnit: null };
}

export function calculateProductNutrition(product, nutriments) {
    if (product.inputAmount === null || product.inputAmount <= 0) return null;

    if (product.inputUnit === "serving") {
        return nutriments.reduce((acc, { key }) => {
            const perServingValue = product.perServing?.[key];
            if (perServingValue != null) {
                acc[key] = perServingValue * product.inputAmount;
                return acc;
            }

            const canFallbackToBasis =
                product.servingAmount != null &&
                product.servingUnit === product.basisUnit &&
                product.per100?.[key] != null &&
                product.basisAmount > 0;

            acc[key] = canFallbackToBasis
                ? (product.per100[key] * product.servingAmount / product.basisAmount) * product.inputAmount
                : 0;

            return acc;
        }, {});
    }

    if (product.inputUnit === product.basisUnit) {
        return nutriments.reduce((acc, { key }) => {
            acc[key] = (product.per100[key] ?? 0) * product.inputAmount / product.basisAmount;
            return acc;
        }, {});
    }

    return null;
}

export function calculateMealTotals(products, nutriments) {
    const mealTotals = {};
    nutriments.forEach(({ key }) => {
        mealTotals[key] = 0;
        products.forEach(product => {
            if (product.calculated) {
                mealTotals[key] += product.calculated[key] || 0;
            }
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