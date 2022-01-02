import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { persistStore } from 'redux-persist';
import rootReducer from './reducers/rootReducer';
const middleware = [thunk];
export const store = createStore(rootReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);
// eslint-disable-next-line import/no-anonymous-default-export
export default { store , persistor };

