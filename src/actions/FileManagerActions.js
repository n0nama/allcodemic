export const ADD_BOOK = 'ADD_BOOK';
export const DELETE_BOOK = 'DELETE_BOOK';
export const EDIT_BOOK = 'EDIT_BOOK';
export const SORT_BOOKS = 'SORT_BOOKS'

export function addNewBook(book) {
    const action = {
        type: ADD_BOOK,
        book
    }
    return action;
}

export function editBook(id) {
    const action = {
        type: EDIT_BOOK,
        id
    }
    return action;
}

export function deleteBook(id) {
    const action = {
        type: DELETE_BOOK,
        id
    }
    return action;
}

export function sortBooks(order) {
    const action = {
        type: SORT_BOOKS,
        order
    }
    return action;
}