import { combineReducers } from 'redux';
import tree from './FileManager/FileManagerReducer';
import files from './EditorReducer';

const rootReducer = combineReducers({
    tree, files
})

export default rootReducer;