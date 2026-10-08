export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequest {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly timeoutMs: number;
}

export class HttpRequestBuilder {
  private method: HttpMethod = 'GET';
  private baseUrl = '';
  private readonly query = new URLSearchParams();
  private readonly headers: Record<string, string> = {};
  private body?: string;
  private timeoutMs = 30_000;

  static get(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().url(url);
  }

  static post(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().url(url).withMethod('POST');
  }

  url(url: string): this {
    this.baseUrl = url;
    return this;
  }

  withMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  header(name: string, value: string): this {
    this.headers[name.toLowerCase()] = value;
    return this;
  }

  param(name: string, value: string | number): this {
    this.query.append(name, String(value));
    return this;
  }

  json(payload: unknown): this {
    this.body = JSON.stringify(payload);
    return this.header('content-type', 'application/json');
  }

  timeout(ms: number): this {
    this.timeoutMs = ms;
    return this;
  }

  build(): HttpRequest {
    if (!this.baseUrl) throw new Error('URL is required');
    if (this.body !== undefined && this.method === 'GET') throw new Error('GET request cannot have a body');

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
