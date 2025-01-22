import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
	dsn: 'https://bf07c14d1e5138956b4cbea78201ad50@o4507669768568832.ingest.us.sentry.io/4508687110045696',
	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
