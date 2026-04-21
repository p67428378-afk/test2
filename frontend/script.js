const portfolioList = document.getElementById('portfolio-list');
const createPortfolioForm = document.getElementById('create-portfolio-form');
const clientNameInput = document.getElementById('client-name');
const descriptionInput = document.getElementById('description');

const API_URL = 'http://localhost:8080/api/portfolios';

async function fetchPortfolios() {
    try {
        const response = await fetch(API_URL);
        const portfolios = await response.json();
        renderPortfolios(portfolios);
    } catch (error) {
        console.error('Error fetching portfolios:', error);
    }
}

function renderPortfolios(portfolios) {
    portfolioList.innerHTML = '';
    portfolios.forEach(portfolio => {
        const li = document.createElement('li');
        li.textContent = `${portfolio.clientName}: ${portfolio.description}`;
        portfolioList.appendChild(li);
    });
}

async function createPortfolio(event) {
    event.preventDefault();
    const clientName = clientNameInput.value;
    const description = descriptionInput.value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientName, description })
        });
        const newPortfolio = await response.json();
        clientNameInput.value = '';
        descriptionInput.value = '';
        fetchPortfolios();
    } catch (error) {
        console.error('Error creating portfolio:', error);
    }
}

createPortfolioForm.addEventListener('submit', createPortfolio);

fetchPortfolios();
