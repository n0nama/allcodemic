import { combineReducers } from 'redux';
import tree from './FileManagerReducer';
import files from './EditorReducer';

const rootReducer = combineReducers({
    tree, files
})

export default rootReducer;