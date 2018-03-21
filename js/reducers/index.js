import { combineReducers } from 'redux';
import cardsFixture from './cardsFixture';

const stickers = (state = cardsFixture, action) => {
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
  stickers,
});
