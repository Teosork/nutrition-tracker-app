# Nutrition Tracker App

A web application that helps users track their daily intake by using product barcodes and nutrition data from Open Food Facts.

## Project Goal

The goal of this project is to build a nutrition tracking app that fetches product data from predefined barcodes and displays nutrition values based on user-entered grams, total meal values, and how the meal fits into daily nutrition targets.

## MVP

- Fetch and display products from a predefined barcode list
- Show Kcal, Fat, Carbs, and Protein for each product
- Let the user enter grams for each product
- Recalculate nutrition values based on the entered grams
- Calculate total nutrition values for the full meal
- Compare meal totals against daily nutrition targets
- Show barcodes that could not be matched with product data

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Open Food Facts API

## How to Run

This project uses JavaScript modules, so it should be run through a local server or through the GitHub Pages live link.  
For best results, open it in a normal browser, not only in the VS Code preview window.

### Option 1: GitHub Pages

Open the live app in your browser:
https://teosork.github.io/nutrition-tracker-app/

### Option 2: VS Code Live Server

1. Clone the repository
2. Open the whole project folder in VS Code
3. Make sure the Live Server extension is installed
4. Start Live Server
5. Open the generated local address in your browser

## How to Use

1. Open the app and wait for the predefined products to load automatically.
2. Check the missing barcodes section to see whether any product data could not be retrieved.
3. Enter grams for one or more products.
4. Verify that the nutrition values update based on the entered grams.
5. Verify that the Meal Totals section updates correctly.
6. Verify that the Daily Targets section updates correctly.
7. Try different gram values to confirm that the calculations continue to work as expected.

## Challenges and Solutions

- Understanding the API response: At first, it took time to understand the structure of the Open Food Facts response and identify the exact fields needed. I solved this by logging the response data and extracting only the product name and nutrition values required by the app.

- Handling missing barcode data: Some barcodes did not return product information. To handle this, I stored failed barcodes in a separate array and displayed them in their own section so the rest of the application could continue working.

- Keeping totals and daily targets updated: One of the hardest parts was making sure the meal totals and daily targets updated every time the grams changed. I solved this by recalculating product values first, then recalculating meal totals, and finally re-rendering the totals and targets.

## Future Improvements

- Add manual barcode input, even without camera scanning, so the app is not limited to the predefined products
- Support different units of measurement and serving sizes, since manual input would need more flexible calculation logic
- Save meals with localStorage to avoid losing progress and reduce repeated fetching during use
- Support multiple meals instead of only one meal view
- In a later version, add multiple users and a database to store and manage user-specific nutrition data.
