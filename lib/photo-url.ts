// Stock search returns a page's og image, which is often a site logo, icon or spinner, not the gear.
const NOT_A_PHOTO_FILE = /\.(ico|svg|gif)$/i;
const NOT_A_PHOTO_PATH = /(^|[/_.-])(logo|favicon|icon|og-default|diagram|processing|placeholder|sprite)s?([/_.-]|$)/i;

export function isProductPhoto(url: string | null | undefined): url is string {
  if (!url) return false;
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    return false;
  }
  return !NOT_A_PHOTO_FILE.test(path) && !NOT_A_PHOTO_PATH.test(path);
}
