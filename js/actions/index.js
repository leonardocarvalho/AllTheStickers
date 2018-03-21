const increaseStickerCount = (stickerNumber, quantity = 1) => (dispatch) => {
  dispatch({ type: 'ALTER_STICKER_COUNT', stickerNumber, quantity });
};

const decreaseStickerCount = (stickerNumber, quantity = 1) => (dispatch) => {
  dispatch({ type: 'ALTER_STICKER_COUNT', stickerNumber, quantity: -quantity });
};


export {
  increaseStickerCount,
  decreaseStickerCount,
};
