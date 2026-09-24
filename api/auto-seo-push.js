import { runAutoSeoPush } from '../scripts/auto-seo-push.mjs';

/**
 * Vercel Serverless Function Handler for Automated Global SEO Push
 * Endpoint: /api/auto-seo-push
 */
export default async function handler(req, res) {
  // Allow GET and POST methods for webhooks & cron triggers
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST.'
    });
  }

  // Security Check: env SEO_PUSH_SECRET or CRON_SECRET
  const expectedSecret = process.env.SEO_PUSH_SECRET || process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'] || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
  const cronHeaderSecret = req.headers['x-cron-secret'];
  const querySecret = req.query ? req.query.secret : null;
  const isVercelCron = Boolean(req.headers['x-vercel-cron']);

  if (expectedSecret) {
    const isAuthorized =
      (bearerToken && bearerToken === expectedSecret) ||
      (cronHeaderSecret && cronHeaderSecret === expectedSecret) ||
      (querySecret && querySecret === expectedSecret) ||
      (isVercelCron && (!process.env.REQUIRE_EXPLICIT_BEARER || bearerToken === expectedSecret));

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or missing SEO_PUSH_SECRET token.'
      });
    }
  }

  try {
    const report = await runAutoSeoPush();

    return res.status(200).json({
      success: report.success,
      timestamp: report.timestamp,
      host: report.host,
      executionTimeMs: report.executionTimeMs,
      sitemap: report.sitemap,
      sitemapPing: report.sitemapPing,
      indexNow: {
        submittedCount: report.indexNow?.submittedCount || 0,
        status: report.indexNow?.status || 'unknown',
        statusCode: report.indexNow?.statusCode,
        batches: report.indexNow?.batches || 0
      },
      schemaValidation: {
        totalPagesScanned: report.schemaValidation?.totalPagesScanned || 0,
        validSchemaCount: report.schemaValidation?.validSchemaCount || 0,
        invalidJsonCount: report.schemaValidation?.invalidJsonCount || 0,
        missingSchemaCount: report.schemaValidation?.missingSchemaCount || 0,
        schemaTypesFound: report.schemaValidation?.schemaTypesFound || {}
      },
      internalLinks: report.internalLinks,
      errors: report.errors
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err.message || 'Internal error in SEO push execution',
      timestamp: new Date().toISOString()
    });
  }
}
