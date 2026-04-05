export function renderProducts(products, calculateProductNutrition, updateSummary, nutriments, onDeleteProduct) {
    const myProducts = document.getElementById("products");
    if (!myProducts) return;

    myProducts.querySelectorAll(".product-card").forEach((card) => card.remove());

    for (const product of products) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const inputRow = document.createElement("div");
        const calculatedText = document.createElement("p");

        const recalcAndRender = () => {
            product.calculated = calculateProductNutrition(product, nutriments);
            updateSummary();

            if (product.calculated) {
                calculatedText.textContent = createNutritionText(
                    product.inputAmount,
                    product.inputUnit,
                    product.calculated,
                    nutriments
                );
            } else {
                calculatedText.textContent = "Enter a valid amount to calculate nutrition.";
            }
        };

        const hasServingData = product.servingAmount !== null && product.servingUnit !== null;
        const hasServingNutriments = nutriments.some(({ key }) => product.perServing?.[key] != null);
        const hasServing = hasServingData && hasServingNutriments;

        const unitOptions = [{ value: product.basisUnit, label: product.basisUnit }];
        if (hasServing) {
            const servingLabel = product.servingSize || `${product.servingAmount} ${product.servingUnit}`;
            unitOptions.push({ value: "serving", label: `serving (${servingLabel})` });
        }

        const allowedUnits = new Set(unitOptions.map((option) => option.value));
        if (!allowedUnits.has(product.inputUnit)) {
            product.inputUnit = product.basisUnit;
        }

        if (product.inputAmount === null || product.inputAmount <= 0) {
            product.inputAmount = product.inputUnit === "serving" ? 1 : product.basisAmount;
        }

        const amountLabel = document.createElement("label");
        amountLabel.textContent = "Amount: ";

        const amountInput = document.createElement("input");
        amountInput.type = "number";
        amountInput.value = String(product.inputAmount);

        const applyAmountConstraints = () => {
            if (product.inputUnit === "serving") {
                amountInput.min = "1";
                amountInput.step = "1";
            } else {
                amountInput.min = "0.01";
                amountInput.step = "any";
            }
        };

        applyAmountConstraints();

        const unitSelect = document.createElement("select");
        for (const option of unitOptions) {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            if (option.value === product.inputUnit) optionElement.selected = true;
            unitSelect.append(optionElement);
        }

        amountInput.addEventListener("input", () => {
            const value = Number(amountInput.value);
            if (Number.isNaN(value) || value <= 0) return;

            if (product.inputUnit === "serving" && !Number.isInteger(value)) return;

            product.inputAmount = value;
            recalcAndRender();
        });

        unitSelect.addEventListener("change", () => {
            const previousUnit = product.inputUnit;
            const nextUnit = unitSelect.value;

            product.inputUnit = nextUnit;

            if (previousUnit !== "serving" && nextUnit === "serving") {
                product.inputAmount = 1;
            } else if (previousUnit === "serving" && nextUnit === product.basisUnit) {
                product.inputAmount = product.basisAmount;
            } else if (product.inputAmount == null || product.inputAmount <= 0) {
                product.inputAmount = nextUnit === "serving" ? 1 : product.basisAmount;
            }

            amountInput.value = String(product.inputAmount);
            applyAmountConstraints();
            recalcAndRender();
        });

        amountLabel.append(amountInput, unitSelect);
        inputRow.append(amountLabel);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            if (onDeleteProduct) onDeleteProduct(product.id);
        });

        recalcAndRender();

        productCard.append(productName, inputRow, calculatedText, deleteButton);
        myProducts.append(productCard);
    }
}

function createNutritionText(amount, unit, calculated, nutriments) {
    const shownUnit = unit === "serving" ? "serving(s)" : unit;
    return `For ${formatNumber(amount)}${shownUnit}: ` +
        nutriments
            .map(({ key, label, unit: nutrimentUnit }) =>
                `${label}: ${formatNumber(calculated?.[key] || 0)}${nutrimentUnit}`
            )
            .join(", ");
}

export function renderTotals(mealTotals, nutriments) {
    const productsTotals = document.getElementById("totals-content");
    if (!productsTotals) return;

    productsTotals.innerHTML = "";
    const totalNutriments = document.createElement("p");
    totalNutriments.textContent = nutriments
        .map(({ key, label, unit }) => `${label}: ${formatNumber(mealTotals[key] || 0)}${unit}`)
        .join(", ");
    productsTotals.append(totalNutriments);
}

export function renderTargets(dailyTargets, remainingTargets, nutriments) {
    const targetSection = document.getElementById("targets-content");
    if (!targetSection) return;

    targetSection.innerHTML = "";

    const myDailyTargets = document.createElement("p");
    myDailyTargets.textContent = "Daily Targets: " + nutriments
        .map(({ key, label, unit }) => `${dailyTargets[key]}${unit} ${label}`)
        .join(", ");

    const myRemainingTargets = document.createElement("p");
    myRemainingTargets.innerHTML = "Remaining: " + nutriments
        .map(({ key, label, unit }) => {
            const cssClass = remainingTargets[key] >= 0 ? "onDailyTarget" : "offDailyTarget";
            return `<span class="${cssClass}">${formatNumber(remainingTargets[key] || 0)}${unit} ${label}</span>`;
        })
        .join(", ");

    targetSection.append(myDailyTargets, myRemainingTargets);
}

export function formatNumber(value) {
    if (value == null || Number.isNaN(value)) return "0";
    return Number.isInteger(value) ? value : value.toFixed(1);
}
