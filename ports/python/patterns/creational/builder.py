import json
from dataclasses import dataclass
from types import MappingProxyType
from urllib.parse import urlencode


@dataclass(frozen=True)
class HttpRequest:
    method: str
    url: str
    headers: object
    timeout_ms: int
    body: str | None = None


class HttpRequestBuilder:
    def __init__(self):
        self.method, self.base_url, self.query, self.headers = 'GET', '', [], {}
        self.body, self.timeout_ms = None, 30000

    @staticmethod
    def get(url):
        return HttpRequestBuilder().url(url)

    @staticmethod
    def post(url):
        return HttpRequestBuilder().url(url).with_method('POST')

    def url(self, url):
        self.base_url = url
        return self

    def with_method(self, method):
        self.method = method
        return self

    def header(self, name, value):
        self.headers[name.lower()] = value
        return self

    def param(self, name, value):
        self.query.append((name, str(value)))
        return self

    def json(self, payload):
        self.body = json.dumps(payload, separators=(',', ':'), ensure_ascii=False)
        return self.header('content-type', 'application/json')

    def timeout(self, ms):
        self.timeout_ms = ms
        return self

    def build(self):
        if not self.base_url:
            raise ValueError('URL is required')
        if self.body is not None and self.method == 'GET':
            raise ValueError('GET request cannot have a body')
        query = urlencode(self.query)
        return HttpRequest(self.method, self.base_url + ('?' + query if query else ''), MappingProxyType(dict(self.headers)), self.timeout_ms, self.body)
