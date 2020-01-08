import {curry} from 'ramda';

function hasChilds(node) {
    return (typeof node === 'object')
        && (typeof node.contents !== 'undefined')
        && (node.contents.length > 0);
  }
  
  const TreeAlg = {
    reduce: curry(function reduce(reducerFn, init, node) {
        const acc = reducerFn(init, node);
        if (!hasChilds(node)) {
            return acc;
        }   
        return node.contents.reduce(TreeAlg.reduce(reducerFn), acc);
    }),
    map: curry(function map(mapFn, node) {
        const newNode = mapFn(node);
        if (hasChilds(node)) {
            return newNode;
        }
        newNode.children = node.contents.map(TreeAlg.map(mapFn));
        return newNode;
    }),
  };
  
  function flattenToArray(arr, node) {
    let childs = node.contents ? node.contents.map(el=>el.name):[];
    let hasChildren = node.contents ? true : false;
    let {contents, ...data} = node
    let id = node.name
    let name = node.name.split('/').slice(-1)[0]
    return arr.concat([{...data, children : childs, hasChildren, id, name}]);
  }
  
  const convertArrayToObject = (array, key) =>
    array.reduce(
      (obj, item) => ({
        ...obj,
        [item[key]]: item
      }),
      {}
    );
  
  export const prepareStruct = struct =>{
    const newStructFlat = TreeAlg.reduce(flattenToArray, [], struct[0]);
    const prepNewStructFlat = convertArrayToObject(newStructFlat, "id");
    const finalStruct = {rootId : '.', items : prepNewStructFlat}
    return finalStruct
  }