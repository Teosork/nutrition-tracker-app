 const barcodes = [
    "8076800195057",
    "8076809513759",
    "80024101",
    "00366991",
    "8001230000787",
    "01085808"
 ];

 const dailyTargets = {
    kcal: 2400,
    fat: 70,
    carbs: 220,
    protein: 190,
 };

 const nutriments = [
  { key: "kcal",    label: "Calories", apiKey: "energy-kcal_100g",    unit: "kcal" },
  { key: "fat",     label: "Fat",      apiKey: "fat_100g",            unit: "g"    },
  { key: "carbs",   label: "Carbs",    apiKey: "carbohydrates_100g",  unit: "g"    },
  { key: "protein", label: "Protein",  apiKey: "proteins_100g",       unit: "g"    },
]
 
 export {barcodes, dailyTargets, nutriments};