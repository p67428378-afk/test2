
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const generateStatement = async (accountNumber, startDate, endDate, format) => {
  const response = await axios.post(`${API_URL}/statements/`, {
    account_number: accountNumber,
    start_date: startDate,
    end_date: endDate,
    format: format,
  }, {
    responseType: format === 'pdf' || format === 'excel' ? 'blob' : 'json',
  });

  if (format === 'pdf' || format === 'excel') {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `statement.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } else {
    return response.data;
  }
};
