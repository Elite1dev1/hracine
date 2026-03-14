import Cookies from 'js-cookie';
import { getApiBaseUrl } from '@/utils/apiConfig';

const api = {
  async request(method, url, data = null) {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${url}`;

    const adminInfo = Cookies.get('adminInfo');
    const adminData = adminInfo ? JSON.parse(adminInfo) : null;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (adminData?.accessToken) {
      headers.Authorization = `Bearer ${adminData.accessToken}`;
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw {
        response: {
          status: response.status,
          data: error,
        },
      };
    }

    return response.json();
  },

  get(url) {
    return this.request('GET', url);
  },

  post(url, data) {
    return this.request('POST', url, data);
  },

  patch(url, data) {
    return this.request('PATCH', url, data);
  },

  put(url, data) {
    return this.request('PUT', url, data);
  },

  delete(url) {
    return this.request('DELETE', url);
  },
};

export default api;
