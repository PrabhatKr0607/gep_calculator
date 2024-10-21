document.addEventListener("DOMContentLoaded", function() {
    // Display the current date
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    dateElement.textContent = formattedDate;

    // Check if a stored 22K gold rate exists and if it's from today
    const storedRate = localStorage.getItem('goldRate22K');
    const storedDate = localStorage.getItem('rateDate');
    const currentDay = today.getDate();

    // Function to calculate rates for other karats
    function updateGoldRates(goldRate22K) {
        const goldRate24K = (goldRate22K / 22) * 24;
        const goldRate18K = (goldRate22K / 22) * 18;
        const goldRate14K = (goldRate22K / 22) * 14;

        document.getElementById('goldRate22K').textContent = goldRate22K.toFixed(2);
        document.getElementById('goldRate24K').textContent = goldRate24K.toFixed(2);
        document.getElementById('goldRate18K').textContent = goldRate18K.toFixed(2);
        document.getElementById('goldRate14K').textContent = goldRate14K.toFixed(2);
    }

    if (storedRate && storedDate == currentDay) {
        // If stored rate is available and from today, use it
        updateGoldRates(parseFloat(storedRate));
        document.getElementById('goldRateUpdate').value = storedRate;
    } else {
        // If no stored rate or it's a new day, reset to default
        localStorage.removeItem('goldRate22K');
        localStorage.removeItem('rateDate');
        document.getElementById('goldRate22K').textContent = "Not Set";
    }

    // Update gold rate from input field
    document.getElementById('updateGoldRate').addEventListener('click', function() {
        const newRate = parseFloat(document.getElementById('goldRateUpdate').value);
        if (!isNaN(newRate) && newRate > 0) {
            localStorage.setItem('goldRate22K', newRate);
            localStorage.setItem('rateDate', currentDay);
            updateGoldRates(newRate);
            document.getElementById('goldRateUpdate').value = ''; // Clear input
        } else {
            alert('Please enter a valid gold rate.');
        }
    });

    // Handle form submission
    document.getElementById('goldForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const weight = parseFloat(document.getElementById('weight').value);
        const karat1 = parseFloat(document.getElementById('karat1').value);
        const karat2 = parseFloat(document.getElementById('karat2').value);
        const goldRate = parseFloat(localStorage.getItem('goldRate22K'));
        const discountOnDeduction = parseFloat(document.getElementById('discountOnDeduction').value);

        // Calculate average karat
        const avgKarat = (karat1 + karat2) / 2;

        // Calculate average purity percentage
        const avgPurity = avgKarat / 24;

        // Deduction logic based on purity
        let deductionPercent;
        if (avgPurity >= 0.9125) {
            deductionPercent = 2;
        } else if (avgPurity >= 0.8750 && avgPurity < 0.9125) {
            deductionPercent = 4;
        } else if (avgPurity >= 0.8333 && avgPurity < 0.8750) {
            deductionPercent = (avgKarat >= 20 && avgKarat <= 21) ? 6 : 8;
        } else if (avgPurity >= 0.75 && avgPurity < 0.8333) {
            deductionPercent = 8;
        } else if (avgPurity >= 0.375 && avgPurity < 0.75) {
            deductionPercent = 8;
        }

        // Calculate deduction value
        const deductionValue = (deductionPercent / 100) * weight * goldRate;
        const discountOnDeductionValue = (discountOnDeduction / 100) * deductionValue;
        const totalValue = weight * goldRate - (deductionValue - discountOnDeductionValue);

        // Display the result with animation
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `
            <p><strong>Average Karat:</strong> ${avgKarat.toFixed(2)}K</p>
            <p><strong>Average Purity:</strong> ${(avgPurity * 100).toFixed(2)}%</p>
            <p><strong>Deduction (${deductionPercent}%):</strong> ₹${deductionValue.toFixed(2)}</p>
            <p><strong>Discount on Deduction (${discountOnDeduction}%):</strong> ₹${discountOnDeductionValue.toFixed(2)}</p>
            <p><strong>Total Value after Deduction:</strong> ₹${totalValue.toFixed(2)}</p>
        `;
        
        // Animate result
        resultElement.style.opacity = 1;
        resultElement.style.transform = "translateY(0)";
        
        // Store the gold rate for 22K in local storage
        localStorage.setItem('goldRate22K', goldRate);
        localStorage.setItem('rateDate', currentDay);

        // Update the gold rates display
        updateGoldRates(goldRate);
    });
});