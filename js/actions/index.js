const increaseStickerCount = (stickerNumber, quantity = 1) => (dispatch) => {
  dispatch({ type: 'ALTER_STICKER_COUNT', stickerNumber, quantity });
};

const decreaseStickerCount = (stickerNumber, quantity = 1) => (dispatch) => {
  dispatch({ type: 'ALTER_STICKER_COUNT', stickerNumber, quantity: -quantity });
};

const peerStatusReceived = (status) => (dispatch) => {
  dispatch({ type: 'PEER_STATUS_RECEIVED', status });
};

const introDone = () => (dispatch) => {
  dispatch({ type: 'INTRO_DONE' });
};

export {
  increaseStickerCount,
  decreaseStickerCount,
  peerStatusReceived,
  introDone,
};
