export function renderProducts(products){
    const myProducts = document.getElementById("products");

    for (const product of products) {
        const productCard = document.createElement("div");
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        const productNutriments = document.createElement("p");
        productNutriments.textContent = 
        `Kcal: ${product.kcal || 0}, 
        Fat: ${product.fat || 0}g,
        Carbs: ${product.carbs || 0}g,
        Protein: ${product.protein || 0}g`;
        const productUserGrams = document.createElement("p");
        productUserGrams.textContent = `Grams used: ${product.grams}`;
        productCard.append(productName, productNutriments, productUserGrams);
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
    const productsTotals = document.getElementById("totals")
    const totalNutriments = document.createElement("p");
    totalNutriments.textContent = 
    `Kcal: ${mealTotals.kcal || 0}, 
    Fat: ${mealTotals.fat || 0}g,
    Carbs: ${mealTotals.carbs || 0}g,
    Protein: ${mealTotals.protein || 0}g`;
    productsTotals.append(totalNutriments);
}

export function renderTargets(dailyTargets, remainingTargets){
    const targetSection = document.getElementById("targets");

    const myDailyTargets = document.createElement("p");
    myDailyTargets.textContent = 
    `Daily Targets: ${dailyTargets.kcal} kcal,
    ${dailyTargets.fat}g fat,
    ${dailyTargets.carbs}g carbs,
    ${dailyTargets.protein}g protein`;

    const myRemainingTargets = document.createElement("p");
    myRemainingTargets.textContent = 
    `Remaining: ${formatNumber(remainingTargets.kcal)} kcal,
    ${formatNumber(remainingTargets.fat)}g fat,
    ${formatNumber(remainingTargets.carbs)}g carbs,
    ${formatNumber(remainingTargets.protein)}g protein`;
    targetSection.append(myDailyTargets,myRemainingTargets);
}

function formatNumber(value) {
    return Number.isInteger(value) ? value : value.toFixed(1);
}
