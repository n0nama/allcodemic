import tree_json from '../data/tree.json';
//import { ADD_BOOK, EDIT_BOOK, DELETE_BOOK, SORT_BOOKS } from '../actions';


function tree(state = tree_json, action) {
    switch(action.type){
        default:
            return state;
    }
}

export default tree;