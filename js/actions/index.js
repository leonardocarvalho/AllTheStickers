const addSticker = () => (dispatch) => {
  dispatch({ type: 'NEW_STICKER', sticker: { id: 0 }});
};


export {
  addSticker,
};
