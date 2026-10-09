export class HttpRequestBuilder {
    method = 'GET';
    baseUrl = '';
    query = new URLSearchParams();
    headers = {};
    body;
    timeoutMs = 30_000;
    static get(url) {
        return new HttpRequestBuilder().url(url);
    }
    static post(url) {
        return new HttpRequestBuilder().url(url).withMethod('POST');
    }
    url(url) {
        this.baseUrl = url;
        return this;
    }
    withMethod(method) {
        this.method = method;
        return this;
    }
    header(name, value) {
        this.headers[name.toLowerCase()] = value;
        return this;
    }
    param(name, value) {
        this.query.append(name, String(value));
        return this;
    }
    json(payload) {
        this.body = JSON.stringify(payload);
        return this.header('content-type', 'application/json');
    }
    timeout(ms) {
        this.timeoutMs = ms;
        return this;
    }
    build() {
        if (!this.baseUrl)
            throw new Error('URL is required');
        if (this.body !== undefined && this.method === 'GET')
            throw new Error('GET request cannot have a body');
        const query = this.query.toString();
        return Object.freeze({
            method: this.method,
            url: query ? `${this.baseUrl}?${query}` : this.baseUrl,
            headers: Object.freeze({ ...this.headers }),
            timeoutMs: this.timeoutMs,
            ...(this.body !== undefined && { body: this.body }),
        });
    }
}
