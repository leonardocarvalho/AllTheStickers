const padDigits = (value, numberDigits, filler = '0') => {
  const strValue = value + '';
  return (
    strValue.length >= numberDigits ?
    strValue :
    new Array(numberDigits - strValue.length + 1).join(filler) + strValue
  );
};

const ENCODING27 = '0ABCDEFGHIJKLMNOPQRSTUVXYWZ';

const encodeStickers = (stickers) => {
  let add = (3 - stickers.length % 3) % 3;
  let str = stickers
    .sort((s1, s2) => s1.stickerNumber  - s2.stickerNumber)
    .map(s => s.count > 1 ? 2 : s.count)
  while (add > 0) {
    str.push(0);
    add--;
  }

  let index = 0;
  let encoded = '';
  while (index < str.length) {
    const v = str[index] + str[index + 1] * 3 + str[index + 2] * 9;
    encoded += ENCODING27[v];
    index += 3;
  }

  return encoded;
};

const decodeStickers = (encoded, size) => {
  const decoded = [];
  for (let index = 0; index < encoded.length; index++) {
    let charIndex = ENCODING27.indexOf(encoded[index]);
    if (charIndex === -1) {
      throw encoded;
    }
    decoded.push(charIndex % 3);
    charIndex = parseInt(charIndex / 3);
    decoded.push(charIndex % 3);
    charIndex = parseInt(charIndex / 3);
    decoded.push(charIndex);
  }

  return decoded.slice(0, size);
};


export {
  padDigits,
  encodeStickers,
  decodeStickers,
};
