import { IncomingHttpHeaders } from 'http';

declare module 'http' {
  interface IncomingHttpHeaders {
    signature?: string;
    token?: string;
    scope?: string;
    'x-subject'?: string;
    'x-grant-type'?: string;
    'x-legacy-id'?: string;
    'build-version'?: string;
    'build-number'?: string;
    device?: string;
    model?: string;
  }
}
