export function renderProducts(products, calculateProductNutrition, updateSummary, nutriments){
    const myProducts = document.getElementById("products");

    for (const product of products) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");  
        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productNutriments = document.createElement("p");
        productNutriments.textContent = createNutritionText(
            product.nutritionDataPer,
            product,
            nutriments
        );

        const productCalculatedNutriments = document.createElement("p");
        productCalculatedNutriments.textContent = createNutritionText(
            product.grams,
            product.calculated,
            nutriments
        );

        const productUserGrams = document.createElement("label");
        productUserGrams.textContent = "Grams used: ";
        const productUserGramsInput = document.createElement("input");
        productUserGramsInput.type = "number";
        productUserGramsInput.value = product.grams;
        productUserGramsInput.min = "0";
        productUserGramsInput.step = "1"; 
        productUserGramsInput.addEventListener("input", function () {
            product.grams = Number(productUserGramsInput.value);

            if (isNaN(product.grams) || product.grams < 0) {
                product.grams = 0;
                productUserGramsInput.value = 0;
            }

            calculateProductNutrition(product);
            updateSummary();
            productCalculatedNutriments.textContent = createNutritionText(
                product.grams,
                product.calculated,
                nutriments  
            );
        });
        productUserGrams.append(productUserGramsInput);
        productCard.append(productName, productNutriments, productCalculatedNutriments, productUserGrams);
        myProducts.append(productCard);
    }
}

export function renderMissingProducts(failedBarcodes){
    const myMissingProducts = document.getElementById("missing-barcodes");
    
    if (failedBarcodes.length === 0) {
        myMissingProducts.innerHTML = "";
        return;
    }

    const message = document.createElement("p");
    message.style.marginBottom = "1rem";
    message.textContent = `We couldn't find nutrition data for ${failedBarcodes.length} product(s). 
    The barcode may be invalid or not in the Open Food Facts database.`;
    myMissingProducts.appendChild(message);

    for (const barcode of failedBarcodes){
        const missingBarcodeCard = document.createElement("div");
        const missingBarcodeName = document.createElement("p");
        missingBarcodeName.textContent = barcode;
        missingBarcodeCard.append(missingBarcodeName);
        myMissingProducts.append(missingBarcodeCard);
    }
}

export function renderTotals(mealTotals, nutriments){
    const productsTotals = document.getElementById("totals-content");
    productsTotals.innerHTML = "";
    const totalNutriments = document.createElement("p");
    totalNutriments.textContent = nutriments.map(({ key, label, unit }) => 
        `${label}: ${formatNumber(mealTotals[key])}${unit}`).join(", ");
    productsTotals.append(totalNutriments);
}

export function renderTargets(dailyTargets, remainingTargets, nutriments){
    const targetSection = document.getElementById("targets-content");
    targetSection.innerHTML = "";

    const myDailyTargets = document.createElement("p");
    myDailyTargets.textContent = "Daily Targets: " + nutriments.map(({ key, label, unit }) => 
        `${dailyTargets[key]}${unit} ${label}`).join(", ");

    const myRemainingTargets = document.createElement("p");
    myRemainingTargets.innerHTML = "Remaining: " + nutriments.map(({ key, label, unit }) => {
        const cssClass = remainingTargets[key] >= 0 ? "onDailyTarget" : "offDailyTarget";
        return `<span class="${cssClass}">${formatNumber(remainingTargets[key])}${unit} ${label}</span>`;
    }).join(", ");

    targetSection.append(myDailyTargets, myRemainingTargets);
}

function createNutritionText(grams, product, nutriments) {
    return `For ${formatNumber(grams)}g: `
            + nutriments.map(({ key, label, unit }) =>
            `${label}: ${formatNumber(product[key] || 0)}${unit}`).join(", ");
}

export function formatNumber(value) {
    return Number.isInteger(value) ? value : value.toFixed(1);
}
