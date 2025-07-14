import axios from 'axios'

const api= axios.create({
  baseURL: 'http://localhost:8080',
});

// Add this function to clear suggestions
export const clearSuggestions = async () => {
  const token = localStorage.getItem('token');
  const response = await api.delete('/api/suggestions/clear', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export default api;
