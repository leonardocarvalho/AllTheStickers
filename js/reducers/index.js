import { combineReducers } from 'redux';

const cards = (state = [{count: 2, name: 'Neymar'}], action) => {
  switch (action.type) {
    case 'NEW_CARD':
      const newState = [...state];
      const previousCard = newState[action.data.id];
      newState[action.data.id] = { ...previousCard, count: previousCard.count + 1 };
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  cards,
});
