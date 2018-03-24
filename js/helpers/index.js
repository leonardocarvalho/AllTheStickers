import { BigNumber } from 'bignumber.js'

const padDigits = (value, numberDigits, filler = '0') => {
  const strValue = value + '';
  return (
    strValue.length >= numberDigits ?
    strValue :
    new Array(numberDigits - strValue.length + 1).join(filler) + strValue
  );
};

const encodeStickers = (stickers) => stickers
  .sort((s1, s2) => s1.stickerNumber  - s2.stickerNumber)
  .map(s => s.count > 1 ? 2 : s.count)
  .reduce((acc, n) => acc.times(3).plus(n), new BigNumber(1))
  .toString();

const decodeStickers = (encoded, size) => {
  const decoded = [];
  let index = size;
  let number = new BigNumber(encoded);
  while (index > 0) {
    index--;
    const next = number.modulo(3).toNumber();
    decoded.push(next);
    number = number.dividedToIntegerBy(3);
  }

  // Number should be exactly 1
  console.log(number);

  return decoded.reverse();
};


export {
  padDigits,
  encodeStickers,
  decodeStickers,
};
