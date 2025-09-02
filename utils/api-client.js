const { request } = require('@playwright/test');

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return this;
  }

  setAuthToken(token) {
    this.token = token;
    this.context = this.context.dispose && this.context.dispose();
    return request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(ctx => {
      this.context = ctx;
      return this;
    });
  }

  async get(endpoint, options = {}) {
    const response = await this.context.get(endpoint, options);
    return {
      response,
      data: await this.parseResponse(response)
    };
  }

  async post(endpoint, data = {}, options = {}) {
    const response = await this.context.post(endpoint, {
      data,
      ...options
    });
    return {
      response,
      data: await this.parseResponse(response)
    };
  }

  async put(endpoint, data = {}, options = {}) {
    const response = await this.context.put(endpoint, {
      data,
      ...options
    });
    return {
      response,
      data: await this.parseResponse(response)
    };
  }

  async patch(endpoint, data = {}, options = {}) {
    const response = await this.context.patch(endpoint, {
      data,
      ...options
    });
    return {
      response,
      data: await this.parseResponse(response)
    };
  }

  async delete(endpoint, options = {}) {
    const response = await this.context.delete(endpoint, options);
    return {
      response,
      data: await this.parseResponse(response)
    };
  }

  async parseResponse(response) {
    try {
      return await response.json();
    } catch (error) {
      return await response.text();
    }
  }

  async dispose() {
    await this.context.dispose();
  }
}

module.exports = { ApiClient };