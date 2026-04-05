const dailyTargets = {
  kcal: 2400,
  fat: 70,
  carbs: 220,
  protein: 190,
};

const nutriments = [
  { key: "kcal",    label: "Calories",  keyPer100: "energy-kcal_100g",    keyPerServing: "energy-kcal_serving",   unit: "kcal" },
  { key: "fat",     label: "Fat",       keyPer100: "fat_100g",            keyPerServing: "fat_serving",           unit: "g" },
  { key: "carbs",   label: "Carbs",     keyPer100: "carbohydrates_100g",  keyPerServing: "carbohydrates_serving", unit: "g" },
  { key: "protein", label: "Protein",   keyPer100: "proteins_100g",       keyPerServing: "proteins_serving",      unit: "g" },
];

export { dailyTargets, nutriments };