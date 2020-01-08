import tree_json from '../../data/curr_tree.json';
//import { OPEN_HIDE_FOLDER } from '../../actions/FileManagerActions';
import {prepareStruct} from './utils';

const struct = prepareStruct(tree_json);

function tree(state = struct, action) {
    switch(action.type){
        // case OPEN_HIDE_FOLDER:
        //     let newState = hideOpenElement(state, action.path)
        //     console.log(newState)
        //     return newState;
        default:
            return state;
    }
}

export default tree;