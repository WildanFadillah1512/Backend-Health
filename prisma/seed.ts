import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding database...');

    // Seed Foods
    const foods = [
        // Breakfast
        { name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 54, fats: 6, servingSize: '1 bowl', category: 'breakfast', healthScore: 9 },
        { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 8, fats: 8, servingSize: '200g', category: 'breakfast', healthScore: 8 },
        { name: 'Scrambled Eggs', calories: 200, protein: 14, carbs: 2, fats: 15, servingSize: '2 eggs', category: 'breakfast', healthScore: 7 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, servingSize: '1 medium', category: 'breakfast', healthScore: 9 },
        { name: 'Whole Wheat Toast', calories: 140, protein: 6, carbs: 26, fats: 2, servingSize: '2 slices', category: 'breakfast', healthScore: 7 },

        // Lunch
        { name: 'Grilled Chicken Salad', calories: 450, protein: 38, carbs: 22, fats: 24, servingSize: '1 plate', category: 'lunch', healthScore: 9 },
        { name: 'Nasi Goreng', calories: 400, protein: 12, carbs: 60, fats: 12, servingSize: '1 plate', category: 'lunch', healthScore: 6 },
        { name: 'Chicken Sandwich', calories: 380, protein: 28, carbs: 42, fats: 12, servingSize: '1 sandwich', category: 'lunch', healthScore: 7 },
        { name: 'Quinoa Bowl', calories: 420, protein: 15, carbs: 58, fats: 14, servingSize: '1 bowl', category: 'lunch', healthScore: 9 },

        // Dinner
        { name: 'Salmon with Vegetables', calories: 530, protein: 42, carbs: 28, fats: 28, servingSize: '1 plate', category: 'dinner', healthScore: 10 },
        { name: 'Grilled Chicken Breast', calories: 280, protein: 52, carbs: 0, fats: 6, servingSize: '150g', category: 'dinner', healthScore: 9 },
        { name: 'Brown Rice', calories: 215, protein: 5, carbs: 45, fats: 2, servingSize: '1 cup', category: 'dinner', healthScore: 8 },
        { name: 'Steak with Sweet Potato', calories: 650, protein: 48, carbs: 52, fats: 28, servingSize: '1 plate', category: 'dinner', healthScore: 7 },

        // Snacks
        { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0, servingSize: '1 medium', category: 'snack', healthScore: 10 },
        { name: 'Mixed Nuts', calories: 180, protein: 5, carbs: 6, fats: 16, servingSize: '30g', category: 'snack', healthScore: 8 },
        { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fats: 6, servingSize: '1 bar', category: 'snack', healthScore: 7 },
        { name: 'Hummus with Carrots', calories: 120, protein: 4, carbs: 14, fats: 6, servingSize: '1 serving', category: 'snack', healthScore: 9 },
    ];

    for (const food of foods) {
        await prisma.food.create({ data: food });
    }

    console.log('✅ Created foods');

    // Seed Workouts
    const workouts = [
        {
            name: 'Full Body Strength',
            description: 'Complete full body workout targeting all major muscle groups',
            duration: 30,
            difficulty: 'intermediate',
            bodyPart: 'full_body',
            caloriesBurned: 250,
            exercises: JSON.stringify([
                { name: 'Push-ups', sets: 3, reps: 15, duration: 0 },
                { name: 'Squats', sets: 3, reps: 20, duration: 0 },
                { name: 'Plank', sets: 3, reps: 0, duration: 60 },
                { name: 'Lunges', sets: 3, reps: 12, duration: 0 },
            ]),
        },
        {
            name: 'Core Crusher',
            description: 'Intensive ab workout to strengthen your core',
            duration: 20,
            difficulty: 'advanced',
            bodyPart: 'abs',
            caloriesBurned: 180,
            exercises: JSON.stringify([
                { name: 'Crunches', sets: 4, reps: 25, duration: 0 },
                { name: 'Russian Twists', sets: 3, reps: 30, duration: 0 },
                { name: 'Mountain Climbers', sets: 3, reps: 20, duration: 0 },
                { name: 'Bicycle Crunches', sets: 3, reps: 20, duration: 0 },
            ]),
        },
        {
            name: 'Leg Day Power',
            description: 'Build stronger legs with this intense workout',
            duration: 45,
            difficulty: 'intermediate',
            bodyPart: 'legs',
            caloriesBurned: 320,
            exercises: JSON.stringify([
                { name: 'Squats', sets: 4, reps: 15, duration: 0 },
                { name: 'Leg Press', sets: 3, reps: 12, duration: 0 },
                { name: 'Lunges', sets: 3, reps: 12, duration: 0 },
                { name: 'Calf Raises', sets: 4, reps: 20, duration: 0 },
            ]),
        },
        {
            name: 'Upper Body Blast',
            description: 'Target your arms, chest, and shoulders',
            duration: 35,
            difficulty: 'beginner',
            bodyPart: 'arms',
            caloriesBurned: 200,
            exercises: JSON.stringify([
                { name: 'Push-ups', sets: 3, reps: 10, duration: 0 },
                { name: 'Dumbbell Curls', sets: 3, reps: 12, duration: 0 },
                { name: 'Tricep Dips', sets: 3, reps: 10, duration: 0 },
                { name: 'Shoulder Press', sets: 3, reps: 10, duration: 0 },
            ]),
        },
        {
            name: 'Chest & Shoulders',
            description: 'Build a strong upper body',
            duration: 25,
            difficulty: 'intermediate',
            bodyPart: 'chest',
            caloriesBurned: 190,
            exercises: JSON.stringify([
                { name: 'Bench Press', sets: 4, reps: 10, duration: 0 },
                { name: 'Chest Flys', sets: 3, reps: 12, duration: 0 },
                { name: 'Shoulder Press', sets: 3, reps: 10, duration: 0 },
                { name: 'Lateral Raises', sets: 3, reps: 15, duration: 0 },
            ]),
        },
        {
            name: 'Back Strengthening',
            description: 'Develop a stronger back and better posture',
            duration: 30,
            difficulty: 'beginner',
            bodyPart: 'back',
            caloriesBurned: 210,
            exercises: JSON.stringify([
                { name: 'Pull-ups', sets: 3, reps: 8, duration: 0 },
                { name: 'Rows', sets: 3, reps: 12, duration: 0 },
                { name: 'Deadlifts', sets: 3, reps: 10, duration: 0 },
                { name: 'Back Extensions', sets: 3, reps: 15, duration: 0 },
            ]),
        },
    ];

    for (const workout of workouts) {
        await prisma.workout.create({ data: workout });
    }

    console.log('✅ Created workouts');
    console.log('🌱 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
