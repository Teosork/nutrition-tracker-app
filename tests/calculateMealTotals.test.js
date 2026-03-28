import { describe, it, expect } from 'vitest';
import { calculateMealTotals } from "../src/app.js";
import { nutriments } from "../src/data.js";

describe('calculateMealTotals', () => {
    it('should sum nutrition totals correctly with positive values', () => {
        const products = [
            { calculated: { kcal: 100, fat: 5, carbs: 20, protein: 10 } },
            { calculated: { kcal: 150, fat: 8, carbs: 30, protein: 15 } }
        ];
        const result = calculateMealTotals(products, nutriments);
        
        expect(result.kcal).toBe(250);
        expect(result.fat).toBe(13);
        expect(result.carbs).toBe(50);
        expect(result.protein).toBe(25);
    });

    it('should handle products with undefined calculated values', () => {
        const products = [
            { calculated: { kcal: 100, fat: 5, carbs: 20, protein: 10 } },
            { calculated: { kcal: undefined, fat: undefined, carbs: undefined, protein: undefined } }
        ];
        const result = calculateMealTotals(products, nutriments);
        
        expect(result.kcal).toBe(100);
        expect(result.fat).toBe(5);
        expect(result.carbs).toBe(20);
        expect(result.protein).toBe(10);
    });

    it('should sum nutrition totals correctly with decimal values', () => {
        const products = [
            { calculated: { kcal: 100.5, fat: 5.2, carbs: 20.8, protein: 10.3 } },
            { calculated: { kcal: 150.3, fat: 8.7, carbs: 30.5, protein: 15.9 } }
        ];
        const result = calculateMealTotals(products, nutriments);
        
        expect(result.kcal).toBeCloseTo(250.8);
        expect(result.fat).toBeCloseTo(13.9);
        expect(result.carbs).toBeCloseTo(51.3);
        expect(result.protein).toBeCloseTo(26.2);
    });

    it('should return zero totals for empty products array', () => {
        const products = [];
        const result = calculateMealTotals(products, nutriments);
        
        expect(result.kcal).toBe(0);
        expect(result.fat).toBe(0);
        expect(result.carbs).toBe(0);
        expect(result.protein).toBe(0);
    });
});