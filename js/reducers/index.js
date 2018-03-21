import { combineReducers } from 'redux';
import cardsFixture from './cardsFixture';

const stickers = (state = cardsFixture, action) => {
  switch (action.type) {
    case 'ALTER_STICKER_COUNT':
      const { stickerNumber, quantity } = action;
      const stickerIndex = state.findIndex(s => s.stickerNumber === stickerNumber);
      const sticker = state[stickerIndex];
      const newState = [...state];
      newState[stickerIndex] = { ...sticker, count: Math.max(sticker.count + quantity, 0) };
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  stickers,
});
