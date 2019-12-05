import files_json from '../data/files.json';
import { ACTIVE_FILE, CLOSE_FILE, CREATE_OR_OPEN_NEW_FILE } from '../actions/EditorActions';

let tempFileIndex = 1;

function files(state = files_json, action) {
    switch(action.type){
        case ACTIVE_FILE:
            let newState = state.map(f=>{
                if(f.path === action.path){
                    f.active = true
                } else {
                    f.active = false
                }
                return f;
            });
            return newState;
        case CLOSE_FILE:
            if(action.path.search('temp') !== -1){
                if(tempFileIndex > 1){
                    tempFileIndex -= 1;
                } else {
                    tempFileIndex = 1;
                } 
            }
            let closedState = state.filter(f=> f.path !== action.path);
            let isActive = false;
            closedState.map(f=>{
                if(f.active === true){
                    isActive = true;
                }
                return f;
            });
            if(isActive){
                return closedState;
            } else {
                let updState = closedState.map((f,i)=>{
                    if(i === 0){
                        f.active = true;
                    }
                    return f; 
                });
                return updState;
            };
        case CREATE_OR_OPEN_NEW_FILE:
            if(action.file === undefined ){
                let creationState = state.map(f=>{
                    f.active = false
                    return f;
                });
                let tempFile = {
                    name : "Untitled " + tempFileIndex,
                    active: true,
                    path: "temp" + tempFileIndex
                };
                let updatedState = [tempFile, ...creationState];
                tempFileIndex += 1;
                return updatedState;
            } else {
                let openState = state.map(f=>{
                    f.active = false
                    return f;
                });
                let opCheck = openState.filter(f => action.file.path === f.path);
                if(opCheck.length > 0){
                    openState = state.map(f=>{
                        if(action.file.path === f.path){
                            f.active = true;
                        }
                        return f;
                    });
                    //console.log("OpenState", openState)
                } else {
                    action.file.active = true;
                    openState = [action.file, ...state];
                };
                return openState;
            }
        default:
            return state;
    }
}

export default files;