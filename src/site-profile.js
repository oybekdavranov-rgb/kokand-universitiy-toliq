'use strict';
/**
 * SAYT PROFILI — qaysi to'plamlar (jadvallar) shu loyihada faol.
 *
 * Loyiha ikki mustaqil saytga ajratilganda har biri o'z profilini oladi:
 *   - "university" — Kokand University asosiy sayti
 *   - "castle"     — Talabalar shaharchasi sayti
 *   - "all"        — ikkalasi bir serverda (birlashgan variant)
 *
 * SITE_PROFILE muhit o'zgaruvchisi yoki shu fayldagi DEFAULT bilan belgilanadi.
 */

const PROFILES = {
  university: {
    label: 'Kokand University',
    collections: ['news', 'achievements', 'distinctions', 'interests', 'programmes', 'stories', 'gallery'],
    homepage: 'index.html',
  },
  castle: {
    label: 'Talabalar shaharchasi',
    collections: ['residences', 'castle_pages', 'applications'],
    homepage: 'shaharcha.html',
  },
  all: {
    label: 'Kokand University + Shaharcha',
    collections: ['news', 'achievements', 'distinctions', 'interests', 'programmes', 'stories', 'gallery',
      'residences', 'castle_pages', 'applications'],
    homepage: 'index.html',
  },
};

const DEFAULT_PROFILE = 'all';
const name = process.env.SITE_PROFILE && PROFILES[process.env.SITE_PROFILE]
  ? process.env.SITE_PROFILE
  : DEFAULT_PROFILE;

const profile = { name, ...PROFILES[name] };
const enabled = new Set(profile.collections);

/** Shu profilda to'plam faolmi? */
function has(collection) {
  return enabled.has(collection);
}

module.exports = { profile, PROFILES, has };
