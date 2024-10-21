document.addEventListener("DOMContentLoaded", () => {
    const currentDateElement = document.getElementById("currentDate");
    const goldRate22KElement = document.getElementById("goldRate22K");
    const goldRate24KElement = document.getElementById("goldRate24K");
    const goldRate18KElement = document.getElementById("goldRate18K");
    const goldRate14KElement = document.getElementById("goldRate14K");

    // Set current date
    const today = new Date().toLocaleDateString();
    currentDateElement.innerText = today;

    // Initialize gold rates
    let goldRate22K = 0;
    let goldRate24K = 0;
    let goldRate18K = 0;
    let goldRate14K = 0;

    // Function to update gold rates based on 22K
    function updateGoldRates() {
        goldRate22K = parseFloat(document.getElementById("goldRateUpdate").value);
        goldRate24K = (goldRate22K / 22) * 24;
        goldRate18K = (goldRate22K / 22) * 18;
        goldRate14K = (goldRate22K / 22) * 14;

        // Update the gold rate elements
        goldRate22KElement.innerText = goldRate22K.toFixed(2);
        goldRate24KElement.innerText = goldRate24K.toFixed(2);
        goldRate18KElement.innerText = goldRate18K.toFixed(2);
        goldRate14KElement.innerText = goldRate14K.toFixed(2);
    }

    // Update gold rate button event listener
    document.getElementById("updateGoldRate").addEventListener("click", updateGoldRates);

    // Calculate function
    document.getElementById("goldForm").addEventListener("submit", (event) => {
        event.preventDefault();
        
        const weight = parseFloat(document.getElementById("weight").value);
        const karat1 = parseFloat(document.getElementById("karat1").value);
        const karat2 = parseFloat(document.getElementById("karat2").value);
        const discountOnDeduction = parseFloat(document.getElementById("discountOnDeduction").value);
        
        // Calculate average karat and average purity
        const averageKarat = (karat1 + karat2) / 2;
        let purity;
        let deduction;
        
        if (averageKarat >= 91.25) {
            purity = "91.25 - 99.99";
            deduction = 2;
        } else if (averageKarat >= 87.50) {
            purity = "87.50 - 91.24";
            deduction = 4;
        } else if (averageKarat >= 83.33) {
            purity = "83.33 - 87.49";
            deduction = 6;
        } else if (averageKarat >= 75.00) {
            purity = "75.00 - 83.32";
            deduction = 8;
        } else {
            purity = "37.50 - 74.99";
            deduction = 8;
        }

        // Calculate net weight and price
        const pricePerGram = goldRate22K; // use the 22K gold rate for pricing
        const totalValue = weight * pricePerGram;
        const totalDeduction = (totalValue * deduction) / 100;
        const discountValue = (totalDeduction * discountOnDeduction) / 100;
        const netValue = totalValue - totalDeduction + discountValue;

        // Display results
        const result = document.getElementById("result");
        result.innerHTML = `
            <h3>Calculation Results:</h3>
            <p><strong>Average Karatage:</strong> ${averageKarat.toFixed(2)} K</p>
            <p><strong>Average Purity:</strong> ${purity}</p>
            <p><strong>Total Value:</strong> ₹${totalValue.toFixed(2)}</p>
            <p><strong>Deduction:</strong> ₹${totalDeduction.toFixed(2)} (${deduction}%)</p>
            <p><strong>Discount on Deduction:</strong> ₹${discountValue.toFixed(2)} (${discountOnDeduction}%)</p>
            <p><strong>Net Value:</strong> ₹${netValue.toFixed(2)}</p>
        `;
        result.style.opacity = 1; // Show result
    });
});