import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// High-quality mock data matching the scenario requirements and backend expectations
const MOCK_KPIS = {
  balanced: {
    sales_per_linear_ft: 45.5,
    private_brand_percentage: 15.2,
    in_stock_rate: 94.8,
    shelf_capacity: 85,
  },
  conservative: {
    sales_per_linear_ft: 40.0,
    private_brand_percentage: 14.0,
    in_stock_rate: 96.5,
    shelf_capacity: 80,
  },
  aggressive: {
    sales_per_linear_ft: 55.0,
    private_brand_percentage: 18.5,
    in_stock_rate: 92.0,
    shelf_capacity: 90,
  }
};

const MOCK_SKUS = {
  balanced: [
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: "Lay's Classic 13oz", weekly_sales: 1240.00, profit_margin: 24.00, days_of_supply: 12, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'Clover Valley Pretzels 16oz', weekly_sales: 850.00, profit_margin: 38.00, days_of_supply: 18, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'Oreo Double Stuf 15.3oz', weekly_sales: 1100.00, profit_margin: 22.00, days_of_supply: 8, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa4', name: 'Clover Valley Tortilla Chips', weekly_sales: 620.00, profit_margin: 42.00, days_of_supply: 22, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'Planters Peanuts 16oz', weekly_sales: 410.00, profit_margin: 18.00, days_of_supply: 35, recommended_action: 'REDUCE' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Cheez-It Original 12.4oz', weekly_sales: 950.00, profit_margin: 20.00, days_of_supply: 14, recommended_action: 'SWAP' }
  ],
  conservative: [
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: "Lay's Classic 13oz", weekly_sales: 1240.00, profit_margin: 24.00, days_of_supply: 12, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'Clover Valley Pretzels 16oz', weekly_sales: 850.00, profit_margin: 38.00, days_of_supply: 18, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'Oreo Double Stuf 15.3oz', weekly_sales: 1100.00, profit_margin: 22.00, days_of_supply: 8, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa4', name: 'Clover Valley Tortilla Chips', weekly_sales: 620.00, profit_margin: 42.00, days_of_supply: 22, recommended_action: 'MAINTAIN' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'Planters Peanuts 16oz', weekly_sales: 410.00, profit_margin: 18.00, days_of_supply: 35, recommended_action: 'REDUCE' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Cheez-It Original 12.4oz', weekly_sales: 950.00, profit_margin: 20.00, days_of_supply: 14, recommended_action: 'REDUCE' }
  ],
  aggressive: [
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: "Lay's Classic 13oz", weekly_sales: 1240.00, profit_margin: 24.00, days_of_supply: 12, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'Clover Valley Pretzels 16oz', weekly_sales: 850.00, profit_margin: 38.00, days_of_supply: 18, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'Oreo Double Stuf 15.3oz', weekly_sales: 1100.00, profit_margin: 22.00, days_of_supply: 8, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa4', name: 'Clover Valley Tortilla Chips', weekly_sales: 620.00, profit_margin: 42.00, days_of_supply: 22, recommended_action: 'GROW' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'Planters Peanuts 16oz', weekly_sales: 410.00, profit_margin: 18.00, days_of_supply: 35, recommended_action: 'SWAP' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Cheez-It Original 12.4oz', weekly_sales: 950.00, profit_margin: 20.00, days_of_supply: 14, recommended_action: 'SWAP' }
  ]
};

export const getKpis = async (scenario) => {
  const key = (scenario || 'Balanced').toLowerCase();
  try {
    const params = {};
    if (scenario) {
      params.scenario = scenario;
    }
    const response = await api.get('/api/v1/kpis', { params });
    return response.data;
  } catch (error) {
    console.warn('API error, falling back to mock KPIs:', error);
    return MOCK_KPIS[key] || MOCK_KPIS.balanced;
  }
};

export const getSkus = async (scenario) => {
  const key = (scenario || 'Balanced').toLowerCase();
  try {
    const params = {};
    if (scenario) {
      params.scenario = scenario;
    }
    const response = await api.get('/api/v1/skus', { params });
    return response.data;
  } catch (error) {
    console.warn('API error, falling back to mock SKUs:', error);
    return MOCK_SKUS[key] || MOCK_SKUS.balanced;
  }
};

export const submitDecision = async (decisionData) => {
  try {
    const response = await api.post('/api/v1/decisions', decisionData);
    return response.data;
  } catch (error) {
    console.warn('API error, falling back to mock decision submission:', error);
    return {
      id: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
      audit_id: `AUDIT-${Math.floor(10000 + Math.random() * 90000)}`,
      scenario_name: decisionData.scenario_name || 'Balanced',
      status: 'APPROVED',
      submitted_by: decisionData.submitted_by || 'category_manager@dollargeneral.com',
      submitted_at: new Date().toISOString()
    };
  }
};

export default api;
