// Este arquivo decide qual URL da API usar.
// Em produção (na Vercel), ele usará a URL do Render.
// No seu PC, ele usará o localhost.
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default apiUrl;