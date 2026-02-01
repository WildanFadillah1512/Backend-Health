/**
 * BMI Calculation Service
 * 
 * BMI = weight (kg) / (height (m))^2
 * 
 * Categories:
 * - Underweight: BMI < 18.5
 * - Normal: 18.5 <= BMI < 25
 * - Overweight: 25 <= BMI < 30
 * - Obese: BMI >= 30
 */

export interface BMIResult {
    bmi: number;
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
    description: string;
}

export function calculateBMI(weight: number, height: number): BMIResult {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmi * 10) / 10;

    let category: BMIResult['category'];
    let description: string;

    if (roundedBMI < 18.5) {
        category = 'underweight';
        description = 'You are underweight. Consider consulting a nutritionist.';
    } else if (roundedBMI < 25) {
        category = 'normal';
        description = 'You have a healthy weight. Keep it up!';
    } else if (roundedBMI < 30) {
        category = 'overweight';
        description = 'You are overweight. A balanced diet and exercise can help.';
    } else {
        category = 'obese';
        description = 'You are obese. Please consult a healthcare professional.';
    }

    return {
        bmi: roundedBMI,
        category,
        description
    };
}

/**
 * BMR Calculation using Mifflin-St Jeor Equation
 * 
 * For men: BMR = (10 × weight/kg) + (6.25 × height/cm) − (5 × age/year) + 5
 * For women: BMR = (10 × weight/kg) + (6.25 × height/cm) − (5 × age/year) − 161
 */

export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number {
    const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
    const bmr = gender === 'male' ? baseBMR + 5 : baseBMR - 161;

    return Math.round(bmr);
}

/**
 * TDEE Calculation
 * 
 * TDEE = BMR × Activity Multiplier
 * 
 * Activity Levels:
 * - Sedentary (little/no exercise): 1.2
 * - Lightly active (1-3 days/week): 1.375
 * - Moderately active (3-5 days/week): 1.55
 * - Very active (6-7 days/week): 1.725
 * - Extremely active (athlete): 1.9
 */

export type ActivityLevel =
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extremely_active';

const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multiplier = activityMultipliers[activityLevel];
    return Math.round(bmr * multiplier);
}

/**
 * Calculate target calories based on goal
 * 
 * Goals:
 * - lose_weight: TDEE - 500 (lose ~0.5kg/week)
 * - gain_muscle: TDEE + 300 (gain ~0.25kg/week)
 * - stay_healthy: TDEE (maintain weight)
 */

export type Goal = 'lose_weight' | 'gain_muscle' | 'stay_healthy';

export function calculateTargetCalories(tdee: number, goal: Goal): number {
    switch (goal) {
        case 'lose_weight':
            return Math.round(tdee - 500);
        case 'gain_muscle':
            return Math.round(tdee + 300);
        case 'stay_healthy':
            return Math.round(tdee);
    }
}

/**
 * Calculate macro distribution based on goal
 * 
 * Returns grams of protein, carbs, and fats
 */

export interface MacroDistribution {
    protein: number; // in grams
    carbs: number;   // in grams
    fats: number;    // in grams
}

export function calculateMacros(
    targetCalories: number,
    goal: Goal,
    weight: number
): MacroDistribution {
    let proteinPercentage: number;
    let fatPercentage: number;
    let carbPercentage: number;

    if (goal === 'lose_weight') {
        proteinPercentage = 0.35; // 35% protein
        fatPercentage = 0.25;     // 25% fat
        carbPercentage = 0.40;    // 40% carbs
    } else if (goal === 'gain_muscle') {
        proteinPercentage = 0.30; // 30% protein
        fatPercentage = 0.25;     // 25% fat
        carbPercentage = 0.45;    // 45% carbs
    } else {
        proteinPercentage = 0.25; // 25% protein
        fatPercentage = 0.30;     // 30% fat
        carbPercentage = 0.45;    // 45% carbs
    }

    // Calories per gram: Protein = 4, Carbs = 4, Fats = 9
    const proteinCalories = targetCalories * proteinPercentage;
    const carbCalories = targetCalories * carbPercentage;
    const fatCalories = targetCalories * fatPercentage;

    return {
        protein: Math.round(proteinCalories / 4),
        carbs: Math.round(carbCalories / 4),
        fats: Math.round(fatCalories / 9)
    };
}
