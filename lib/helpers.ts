import { StaticImageData } from 'next/image';

export function getAvatarSrc(src: string | StaticImageData) {
  return typeof src === 'string' ? src : src.src;
}

export function convertToSubcurrency(amount: string) {
  return Math.round(Number(amount) * 100);
}

export default convertToSubcurrency;
