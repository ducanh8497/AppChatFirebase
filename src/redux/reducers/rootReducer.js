import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import UserReducer from './userReducer'
const persisConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}
const rootReducer = combineReducers({
    user: UserReducer,
});
export default persistReducer(persisConfig, rootReducer);