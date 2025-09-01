// buttons and price elements
const monthlyBtn = document.getElementById('monthly-btn');
const yearlyBtn = document.getElementById('yearly-btn');
const prices = document.querySelectorAll('.price');

// Function to update prices based on the selected button
function updatePrices(isMonthly) {
    prices.forEach(price => {
        const monthlyPrice = price.getAttribute('data-monthly');
        const annualPrice = price.getAttribute('data-annual');

        if (isMonthly) {
            // monthly price
            price.textContent = `$${monthlyPrice}/month`;
        } else {
            // annual price
            price.textContent = `$${annualPrice}/year`;
        }
    });
}


// Add event listeners to the buttons
monthlyBtn.addEventListener('click', () => {
    monthlyBtn.classList.add('active');
    yearlyBtn.classList.remove('active');
    updatePrices(true);
});

yearlyBtn.addEventListener('click', () => {
    yearlyBtn.classList.add('active');
    monthlyBtn.classList.remove('active');
    updatePrices(false);
});

updatePrices(true);




