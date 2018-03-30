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

const migrations = [
  'ZERO_BASED_CARDS',
];
const performMigrations = () => (dispatch) => {
  migrations.forEach((type) => dispatch({ type }));
};

export {
  increaseStickerCount,
  decreaseStickerCount,
  peerStatusReceived,
  introDone,
  performMigrations,
};
