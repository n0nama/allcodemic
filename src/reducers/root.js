import { combineReducers } from 'redux';
import tree from './FileManagerReducer';
//import BookShelfReducer from './BookShelfReducer';

const rootReducer = combineReducers({
    tree
})

export default rootReducer;