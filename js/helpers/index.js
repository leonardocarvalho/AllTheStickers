const padDigits = (value, numberDigits, filler = '0') => {
  const strValue = value + '';
  return (
    strValue.length >= numberDigits ?
    strValue :
    new Array(numberDigits - strValue.length + 1).join(filler) + strValue
  );
};


export {
  padDigits
};
