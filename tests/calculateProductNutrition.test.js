import { describe, it, expect } from 'vitest';
import { calculateProductNutrition } from "../src/app.js";
import { nutriments } from "../src/data.js";

describe('calculateProductNutrition', () => {
    it('should calculate nutrition correctly with positive values', () => {
        const product = { kcal: 100, fat: 5, carbs: 20, protein: 10, grams: 100, nutritionDataPer: 100 };
        const result = calculateProductNutrition(product, nutriments);
        
        expect(result.kcal).toBe(100);
        expect(result.fat).toBe(5);
        expect(result.carbs).toBe(20);
        expect(result.protein).toBe(10);
    });

    it('should calculate nutrition correctly with undefined values', () => {
        const product = { kcal: undefined, fat: 5, carbs: undefined, protein: 10, grams: 100, nutritionDataPer: 100 };
        const result = calculateProductNutrition(product, nutriments);
        
        expect(result.kcal).toBe(0);
        expect(result.fat).toBe(5);
        expect(result.carbs).toBe(0);
        expect(result.protein).toBe(10);
    });

    it('should calculate nutrition correctly with zero grams', () => {
        const product = { kcal: 100, fat: 5, carbs: 20, protein: 10, grams: 0, nutritionDataPer: 100 };
        const result = calculateProductNutrition(product, nutriments);
        
        expect(result.kcal).toBe(0);
        expect(result.fat).toBe(0);
        expect(result.carbs).toBe(0);
        expect(result.protein).toBe(0);
    });

    it('should calculate nutrition correctly with decimal numbers', () => {
        const product = { kcal: 250.5, fat: 8.3, carbs: 45.7, protein: 15.2, grams: 150, nutritionDataPer: 100 };
        const result = calculateProductNutrition(product, nutriments);
        
        expect(result.kcal).toBe(375.75);
        expect(result.fat).toBe(12.45);
        expect(result.carbs).toBe(68.55);
        expect(result.protein).toBe(22.8);
    });
});