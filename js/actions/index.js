const addCard = () => (dispatch) => {
  dispatch({ type: 'NEW_CARD', data: { id: 0 }});
};


export {
  addCard,
};
