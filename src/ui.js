export function renderProducts(products, calculateProductNutrition, updateSummary){
    const myProducts = document.getElementById("products");

    for (const product of products) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");  
        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productNutriments = document.createElement("p");
        productNutriments.textContent = createNutritionText(
            product.nutritionDataPer,
            product.kcal,
            product.fat,
            product.carbs,
            product.protein
        );

        const productCalculatedNutriments = document.createElement("p");
        productCalculatedNutriments.textContent = createNutritionText(
            product.grams,
            product.calculatedKcal,
            product.calculatedFat,
            product.calculatedCarbs,
            product.calculatedProtein
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
                product.calculatedKcal,
                product.calculatedFat,
                product.calculatedCarbs,
                product.calculatedProtein
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

export function renderTotals(mealTotals){
    const productsTotals = document.getElementById("totals-content")
    productsTotals.innerHTML = "";
    const totalNutriments = document.createElement("p");
    totalNutriments.textContent = 
    `Kcal: ${formatNumber(mealTotals.kcal)}, 
    Fat: ${formatNumber(mealTotals.fat)}g,
    Carbs: ${formatNumber(mealTotals.carbs)}g,
    Protein: ${formatNumber(mealTotals.protein)}g`;
    productsTotals.append(totalNutriments);
}

export function renderTargets(dailyTargets, remainingTargets){
    const targetSection = document.getElementById("targets-content");
    targetSection.innerHTML = "";

    const myDailyTargets = document.createElement("p");
    myDailyTargets.textContent = 
    `Daily Targets: ${dailyTargets.kcal} kcal,
    ${dailyTargets.fat}g fat,
    ${dailyTargets.carbs}g carbs,
    ${dailyTargets.protein}g protein`;

    const kcalClass = remainingTargets.kcal >= 0 ? "onDailyTarget" : "offDailyTarget";
    const fatClass = remainingTargets.fat >= 0 ? "onDailyTarget" : "offDailyTarget";
    const carbsClass = remainingTargets.carbs >= 0 ? "onDailyTarget" : "offDailyTarget";
    const proteinClass = remainingTargets.protein >= 0 ? "onDailyTarget" : "offDailyTarget";

    const myRemainingTargets = document.createElement("p");
    myRemainingTargets.innerHTML =
    `Remaining: 
    <span class="${kcalClass}">${formatNumber(remainingTargets.kcal)} kcal</span>,
    <span class="${fatClass}">${formatNumber(remainingTargets.fat)}g fat</span>,
    <span class="${carbsClass}">${formatNumber(remainingTargets.carbs)}g carbs</span>,
    <span class="${proteinClass}">${formatNumber(remainingTargets.protein)}g protein</span>`;

    targetSection.append(myDailyTargets, myRemainingTargets);
}

function createNutritionText(grams, kcal, fat, carbs, protein) {
    return `For ${formatNumber(grams)}g: 
            Kcal: ${formatNumber(kcal || 0)}, 
            Fat: ${formatNumber(fat || 0)}g, 
            Carbs: ${formatNumber(carbs || 0)}g, 
            Protein: ${formatNumber(protein || 0)}g`;
}

export function formatNumber(value) {
    return Number.isInteger(value) ? value : value.toFixed(1);
}
