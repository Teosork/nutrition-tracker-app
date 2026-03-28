import { describe, it, expect } from 'vitest';
import { calculateRemainingTargets } from "../src/app.js";
import { nutriments } from "../src/data.js";

describe('calculateRemainingTargets', () => {
    it('should calculate remaining targets correctly with positive values', () => {
        const dailyTargets = { kcal: 2000, fat: 65, carbs: 300, protein: 150 };
        const mealTotals = { kcal: 800, fat: 20, carbs: 100, protein: 50 };
        const result = calculateRemainingTargets(dailyTargets, mealTotals, nutriments);
        
        expect(result.kcal).toBe(1200);
        expect(result.fat).toBe(45);
        expect(result.carbs).toBe(200);
        expect(result.protein).toBe(100);
    });

    it('should handle negative remaining targets', () => {
        const dailyTargets = { kcal: 2000, fat: 65, carbs: 300, protein: 150 };
        const mealTotals = { kcal: 2500, fat: 80, carbs: 350, protein: 200 };
        const result = calculateRemainingTargets(dailyTargets, mealTotals, nutriments);
        
        expect(result.kcal).toBe(-500);
        expect(result.fat).toBe(-15);
        expect(result.carbs).toBe(-50);
        expect(result.protein).toBe(-50);
    });

    it('should return zero when targets match totals', () => {
        const dailyTargets = { kcal: 2000, fat: 65, carbs: 300, protein: 150 };
        const mealTotals = { kcal: 2000, fat: 65, carbs: 300, protein: 150 };
        const result = calculateRemainingTargets(dailyTargets, mealTotals, nutriments);
        
        expect(result.kcal).toBe(0);
        expect(result.fat).toBe(0);
        expect(result.carbs).toBe(0);
        expect(result.protein).toBe(0);
    });

    it('should calculate remaining targets correctly with decimal values', () => {
    const dailyTargets = { kcal: 2000.5, fat: 65.3, carbs: 300.7, protein: 150.2 };
    const mealTotals = { kcal: 800.3, fat: 20.5, carbs: 100.2, protein: 50.8 };
    const result = calculateRemainingTargets(dailyTargets, mealTotals, nutriments);
    
    expect(result.kcal).toBeCloseTo(1200.2);
    expect(result.fat).toBeCloseTo(44.8);
    expect(result.carbs).toBeCloseTo(200.5);
    expect(result.protein).toBeCloseTo(99.4);
    });
});