export function renderProducts(products,calculateProductNutrition, updateSummary){
    const myProducts = document.getElementById("products");

    for (const product of products) {
        const productCard = document.createElement("div");
        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productNutriments = document.createElement("p");
        productNutriments.textContent = 
        `Per 100g: Kcal: ${product.kcal || 0}, 
        Fat: ${product.fat || 0}g,
        Carbs: ${product.carbs || 0}g,
        Protein: ${product.protein || 0}g`;

        const productCalculatedNutriments = document.createElement("p");
        productCalculatedNutriments.textContent =
        `For ${product.grams}g: Kcal: ${product.calculatedKcal || 0}, 
        Fat: ${product.calculatedFat || 0}g,
        Carbs: ${product.calculatedCarbs || 0}g,
        Protein: ${product.calculatedProtein || 0}g`;

        const productUserGrams = document.createElement("label");
        productUserGrams.textContent = "Grams used: ";
        const productUserGramsInput = document.createElement("input");
        productUserGramsInput.type = "number";
        productUserGramsInput.value = product.grams;
        productUserGramsInput.addEventListener("input", function () {
            product.grams = Number(productUserGramsInput.value);
            calculateProductNutrition(product);
            updateSummary();
            productCalculatedNutriments.textContent =
            `For ${product.grams}g: Kcal: ${product.calculatedKcal || 0}, 
            Fat: ${product.calculatedFat || 0}g,
            Carbs: ${product.calculatedCarbs || 0}g,
            Protein: ${product.calculatedProtein || 0}g`;
        });

        productUserGrams.append(productUserGramsInput);
        productCard.append(productName, productNutriments, productCalculatedNutriments, productUserGrams);
        myProducts.append(productCard);
    }
}

export function renderMissingProducts(failedBarcodes){
    const  myMissingProducts = document.getElementById("missing-barcodes");

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


function formatNumber(value) {
    return Number.isInteger(value) ? value : value.toFixed(1);
}
