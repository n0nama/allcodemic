import tree_json from '../data/tree.json';
import { OPEN_HIDE_FOLDER } from '../actions/FileManagerActions';

function hideOpenElement(arr, el){
    let temp = []
    for(let x in arr){
        if(arr[x].path === el){
            arr[x].active = !arr[x].active;
        }
        if(arr[x].children){
            hideOpenElement(arr[x].children, el)
        }
        temp.push(arr[x])
    }
    return temp
}

function tree(state = tree_json, action) {
    switch(action.type){
        case OPEN_HIDE_FOLDER:
            let newState = hideOpenElement(state, action.path)
            console.log(newState)
            return newState;
        default:
            return state;
    }
}

export default tree;