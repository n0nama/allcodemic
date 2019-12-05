export const ACTIVE_FILE = 'ACTIVE_FILE';
export const CLOSE_FILE = 'CLOSE_FILE';
export const CREATE_OR_OPEN_NEW_FILE = 'CREATE_OR_OPEN_NEW_FILE';
//export const SORT_BOOKS = 'SORT_BOOKS'

export function activeFile(path) {
    const action = {
        type: ACTIVE_FILE,
        path
    }
    return action;
}

export function closeFile(path) {
    const action = {
        type: CLOSE_FILE,
        path
    }
    return action;
}

export function createOrOpenNewFile(file) {
    const action = {
        type: CREATE_OR_OPEN_NEW_FILE,
        file
    }
    return action;
}