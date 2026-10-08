const windowMs = 15 * 60 * 1000;
const maxRequests = 10;
const requestsByIp = new Map();

// Limit only feedback creation so reads and health checks remain available.
export default function feedbackRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  let entry = requestsByIp.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    requestsByIp.set(key, entry);
  }

  entry.count += 1;
  res.set('RateLimit-Limit', String(maxRequests));
  res.set('RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));

  if (entry.count > maxRequests) {
    res.set('RateLimit-Reset', String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({
      success: false,
      message: 'Too many feedback submissions. Please try again in a few minutes.',
    });
  }

  for (const [ip, requestEntry] of requestsByIp) {
    if (requestEntry.resetAt <= now) requestsByIp.delete(ip);
  }
  return next();
}
