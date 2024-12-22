import { createStore, combineReducers } from 'redux';
import notesReducer from './reducers/notes';
import userReducer from './reducers/user';

const rootReducer = combineReducers({
  notes: notesReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;
