/** Name of the cookie that carries the session id. */
export const SESSION_COOKIE_NAME = 'sid'

/**
 * Lifetime of the session cookie in milliseconds (2 hours).
 * Must match SESSION_TTL_SECONDS in RedisSessionRepository.
 */
export const SESSION_MAX_AGE_MS = 7200000
