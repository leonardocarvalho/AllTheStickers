import { combineReducers } from 'redux';
import cardsFixture from './cardsFixture';
import uuid from 'uuid/v4';

const stickers = (state = cardsFixture, action) => {
  switch (action.type) {
    case 'ALTER_STICKER_COUNT':
      const { stickerNumber, quantity } = action;
      const stickerIndex = state.findIndex(s => s.stickerNumber === stickerNumber);
      const sticker = state[stickerIndex];
      const newState = [...state];
      newState[stickerIndex] = { ...sticker, count: Math.max(sticker.count + quantity, 0) };
      return newState;
    case 'CLEAR_STICKERS':
      return cardsFixture;
    default:
      return state;
  }
};

const peerStatus = (state = { desired: [], available: [] }, action) => {
  switch(action.type) {
    case 'PEER_STATUS_RECEIVED':
      return action.status;
    default:
      return state;
  }
};

const introDone = (state = false, action) => {
  switch(action.type) {
    case 'INTRO_DONE':
      return true;
    case 'INTRO_RESET':
      return false;
    default:
      return state;
  }
}

const userId = (state = null, action) => {
  switch(action.type) {
    case 'NEW_USER':
      return uuid();
    case 'RESET_USER':
      return null;
    default:
      return state;
  }
};

export default combineReducers({
  stickers,
  peerStatus,
  introDone,
  userId,
});
