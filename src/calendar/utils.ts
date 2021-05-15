import { BASEFONTSIZE } from './config';

export const rem = (len: number) => {
  return `${len / BASEFONTSIZE}rem`;
};

