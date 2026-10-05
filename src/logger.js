'use strict';
/**
 * Bog'liqliksiz structured JSON logger (production'da mashina o'qiy oladigan log).
 * Development'da o'qishga qulay matn, production'da JSON.
 */
const { config } = require('./config');

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN = LEVELS[process.env.LOG_LEVEL] || (config.IS_PROD ? LEVELS.info : LEVELS.debug);

function emit(level, msg, meta) {
  if (LEVELS[level] < MIN) return;
  const rec = { ts: new Date().toISOString(), level, msg, ...meta };
  const line = config.IS_PROD
    ? JSON.stringify(rec)
    : `${rec.ts} ${level.toUpperCase().padEnd(5)} ${msg}` + (meta ? ' ' + JSON.stringify(meta) : '');
  (level === 'error' ? process.stderr : process.stdout).write(line + '\n');
}

module.exports = {
  debug: (m, meta) => emit('debug', m, meta),
  info: (m, meta) => emit('info', m, meta),
  warn: (m, meta) => emit('warn', m, meta),
  error: (m, meta) => emit('error', m, meta),
};
