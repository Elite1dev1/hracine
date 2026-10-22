export const normalizeBlogSlug = (slug = '') =>
  String(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/^blog\//, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
