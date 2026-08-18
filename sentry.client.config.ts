import * as Sentry from '@sentry/nextjs';
import { sanitizeSentryEvent } from './src/lib/monitoring/sentry';

Sentry?.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry?.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  beforeSend(event) {
    return sanitizeSentryEvent(event);
  },
});
