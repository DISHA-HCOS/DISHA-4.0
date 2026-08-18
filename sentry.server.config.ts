import * as Sentry from '@sentry/nextjs';
import { sanitizeSentryEvent } from './src/lib/monitoring/sentry';

Sentry?.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    return sanitizeSentryEvent(event);
  },
});
