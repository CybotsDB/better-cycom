import {
  BANNER_BASE_URI,
  BANNER_ERROR_URI,
} from './constants'

export function getUserColor(user) {
  if (user.vetrank == 1) return '#7281ca';
  if (user.rank == 1) return '#ff394b';
  if (user.vetrank <= 25 && user.vetrank > 0) return '#a2cffd';
  if (user.rank <= 25 && user.rank > 0) return '#fc7c85';
  return '#a0e6a0';
};

export function bannerURI(user) {
  const bannerFile = [
    user.username.replaceAll(" ", "~"),
    "-",
    user.bannerFilename
  ].join('');

  return [BANNER_BASE_URI, bannerFile].join('').toLowerCase();
}
