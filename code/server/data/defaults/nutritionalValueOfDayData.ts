import {NutritionalValueOfDay} from "@/data/meta/models";

export const nutritionalValueOfDayData: NutritionalValueOfDay = {
    dayOfEntry: {year: 2025, month: 4, day: 17},
    caloriesInKcal: 1717,
    proteinInG: 122.8,
    carbsInG: 211.2,
    fatsInG: 51.9,

    breakfastMeals: {
        createdAt: Date.now(),
        foods: [
            {
                name: "Oatmeal",
                weightInG: 100,
                caloriesInKcal: 389,
                proteinInG: 16.9,
                carbsInG: 66.3,
                fatsInG: 6.9
            },
            {
                name: "Banana",
                weightInG: 100,
                caloriesInKcal: 89,
                proteinInG: 1.1,
                carbsInG: 22.8,
                fatsInG: 0.3
            }
        ]
    },
    lunchMeals: {
        createdAt: Date.now(),
        foods: [
            {
                name: "Chicken Breast",
                weightInG: 200,
                caloriesInKcal: 330,
                proteinInG: 32,
                carbsInG: 60,
                fatsInG: 7
            },
            {
                name: "Rice",
                weightInG: 150,
                caloriesInKcal: 180,
                proteinInG: 4,
                carbsInG: 39,
                fatsInG: 0.3
            }
        ]
    },
    dinnerMeals: {
        createdAt: Date.now(),
        foods: [
            {
                name: "Salmon",
                weightInG: 200,
                caloriesInKcal: 400,
                proteinInG: 40,
                carbsInG: 0,
                fatsInG: 22
            },
            {
                name: "Broccoli",
                weightInG: 100,
                caloriesInKcal: 35,
                proteinInG: 2.4,
                carbsInG: 7,
                fatsInG: 0.4
            }
        ]
    },
    snackMeals: {
        createdAt: Date.now(),
        foods: [
            {
                name: "Greek Yogurt",
                weightInG: 200,
                caloriesInKcal: 120,
                proteinInG: 20,
                carbsInG: 10,
                fatsInG: 0
            },
            {
                name: "Almonds",
                weightInG: 30,
                caloriesInKcal: 174,
                proteinInG: 6.4,
                carbsInG: 6.1,
                fatsInG: 15
            }
        ]
    }
}