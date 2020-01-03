import React, { Component } from 'react';
//import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import Tree from './Tree/Tree';
import { mutateTree, moveItemOnTree } from './Tree/utils/tree';
import { Icon } from 'semantic-ui-react';

import tree_json from '../../data/curr_tree.json';
import {curry} from 'ramda';

console.log(tree_json[0])

const tree = {rootId : 0, children :[{
  type: "folder",
  name: "base",
  isExpanded : true,
  id : "/workspace",
  hasChildren: true,
  isChildrenLoading: false,
  children : [
            {
            type: "folder",
            name: "base",
            isExpanded : true,
            id : "/workspace/base",
            hasChildren: true,
            isChildrenLoading: false,
            children: [
                {
                    type: "file",
                    name: "test.py",
                    id : "/workspace/base/test.py",
                    content : "/workspace/base/test.py",
                    hasChildren: false,
                    isChildrenLoading: false,
                    isExpanded : false
                },
                {
                    type:     "folder",
                    name:     "env",
                    isExpanded : true,
                    id : "/workspace/base/env",
                    hasChildren: true,
                    isChildrenLoading: false,
                    children: [
                        {
                            type: "file",
                            name: "bin.bash",
                            id : "/workspace/base/env/bin.bash",
                            content : "/workspace/base/env/bin.bash",
                            hasChildren: false,
                            isChildrenLoading: false,
                            isExpanded : false
                        },
                        {
                            type: "file",
                            name: "python.script",
                            id : "/workspace/base/env/python.script",
                            content : "/workspace/base/env/python.script",
                            hasChildren: false,
                            isChildrenLoading: false,
                            isExpanded : false
                        },
                        {
                            type: "file",
                            name: "temp.log",
                            id : "/workspace/base/env/temp.log",
                            content : "/workspace/base/env/temp.log",
                            hasChildren: false,
                            isChildrenLoading: false,
                            isExpanded : false
                        }
                    ]
                },
                {
                    type: "folder",
                    name: "Poems",
                    id : "/workspace/base/Poems",
                    isExpanded : false,
                    hasChildren: false,
                    isChildrenLoading: false
                },
                {
                    type: "folder",
                    name: "Essays",
                    isExpanded : false,
                    id : "/workspace/base/Essays",
                    hasChildren: true,
                    isChildrenLoading: false,
                    children: [
                        {
                            type: "file",
                            name: "The Fantastic Imagination",
                            id : "/workspace/base/Essays/The Fantastic Imagination",
                            content : "Essays/The Fantastic Imagination",
                            hasChildren: false,
                            isChildrenLoading: false,
                            isExpanded : false
                        },
                        {
                            type: "file",
                            name: "The New Name",
                            id : "/workspace/base/Essays/The New Name",
                            content : "Essays/The New Name",
                            hasChildren: false,
                            isChildrenLoading: false,
                            isExpanded : false
                        }
                    ]
                },
                {
                    type: "file",
                    name: "Our Community",
                    id : "/workspace/base/Our Community",
                    content : "base/Our Community",
                    hasChildren: false,
                    isChildrenLoading: false,
                    isExpanded : false
                },
                {
                    type: "folder",
                    name: "About us",
                    isExpanded : false,
                    id : "/workspace/base/About us",
                    hasChildren: true,
                    isChildrenLoading: false,
                    children: [
                        {
                            type: "folder",
                            name: "Community sponsorship",
                            id : "/workspace/base/About us/Community sponsorship",
                            hasChildren: true,
                            isChildrenLoading: false,
                            isExpanded : false,
                          children: [
                                {
                                    type: "file",
                                    name: "Our Patreon",
                                    id : "/workspace/base/About us/Community sponsorship/Our Patreon",
                                    content : "Community sponsorship/Our Patreon",
                                    hasChildren: false,
                                    isChildrenLoading: false,
                                    isExpanded : false
                                },
                                {
                                    type: "file",
                                    name: "Endowments",
                                    id : "/workspace/base/About us/Community sponsorship/Endowments",
                                    content : "Community sponsorship/Endowments",
                                    hasChildren: false,
                                    isChildrenLoading: false,
                                    isExpanded : false
                                }
                            ]
                        }
                    ]
                }
            ]
            },
            {
            type: "file",
            name: "Forum",
            id : "/workspace/Forum",
            content : "/workspace/Forum",
            hasChildren: false,
            isChildrenLoading: false,
            isExpanded : false
            }
  ]
}
]
};

function hasChilds(node) {
  return (typeof node === 'object')
      && (typeof node.children !== 'undefined')
      && (node.children.length > 0);
}

const TreeAlg = {
  reduce: curry(function reduce(reducerFn, init, node) {
      const acc = reducerFn(init, node);
      if (!hasChilds(node)) {
          return acc;
      }   
      return node.children.reduce(TreeAlg.reduce(reducerFn), acc);
  }),
  map: curry(function map(mapFn, node) {
      const newNode = mapFn(node);
      if (hasChilds(node)) {
          return newNode;
      }
      newNode.children = node.children.map(TreeAlg.map(mapFn));
      return newNode;
  }),
};

function flattenToArray(arr, node) {
    //return arr.id = {...data}
  let childs = node.children ? node.children.map(el=>el.id):[]
  let {children, ...data} = node
  return arr.concat([{...data, children : childs}]);
}

function flattenToArrayN(arr, node) {
  //return arr.id = {...data}
let childs = node.children ? node.children.map(el=>el.name):[];
let hasChildren = node.children ? true : false;
let {children, ...data} = node
let id = node.name
//let name = node.name.split('/')[-1]
return arr.concat([{...data, children : childs, hasChildren, id}]);
}
const flattenedCurrentStruct=TreeAlg.reduce(flattenToArray, [], tree);
const convertArrayToObject = (array, key) =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item
    }),
    {}
  );
const preparedItems = convertArrayToObject(flattenedCurrentStruct.slice(1), "id")
const newStruct = {rootId : '/workspace', items : preparedItems}

const newStructFlat = TreeAlg.reduce(flattenToArrayN, [], tree_json[0]);
const prepNewStructFlat = convertArrayToObject(newStructFlat, "name");
const finalStruct = {rootId : '.', items : prepNewStructFlat}
console.log("NEW_STRUCT", finalStruct);

const complexTree = {
  rootId: '1',
  items: {
    '1': {
      id: '1',
      children: ["1-1"],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      name: 'root',
    },
    '1-1': {
      id: '1-1',
      children: ['1-1-1'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      name: 'First parent',
      type: 'file'
    },
    '1-1-1': {
      id: '1-1-1',
      children: [],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      name: 'First parent',
      type: 'file'
    },
    
  },
};

const getIcon = (item,onExpand,onCollapse) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
        <Icon name="chevron down" size="small" onClick={() => onCollapse(item.id)}/>
    ) : (
        <Icon name="chevron right" size="small" onClick={() => onExpand(item.id)}/>
    )
    
  }
  return <Icon name="file"></Icon>;
};

export default class FMNew extends Component {
  state = {
    tree: finalStruct,
  };

  // static getIcon(item,onExpand,onCollapse) {
  //   if (item.children && item.children.length > 0) {
  //     return item.isExpanded ? (
  //         <ChevronDownIcon
  //           label=""
  //           size="medium"
  //           onClick={() => onCollapse(item.id)}
  //         />
  //     ) : (
  //         <ChevronRightIcon
  //           label=""
  //           size="medium"
  //           onClick={() => onExpand(item.id)}
  //         />
  //     );
  //   }
  //   return <Dot>&bull;</Dot>;
  // }

  renderItem = ({item,onExpand,onCollapse,provided}) => {
    return (
      <div className={"item " + item.type}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        {getIcon(item, onExpand, onCollapse)}
        {item ? item.name : ''}
      </div>
    );
  };

  onExpand = (item) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, item, { isExpanded: true }),
    });
  };

  onCollapse = (item) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, item, { isExpanded: false }),
    });
  };

  onDragEnd = (source, destination) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: newTree,
    });
  };

  render() {
    const { tree } = this.state;
    console.log(this.state)
    return (
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onDragEnd={this.onDragEnd}
            isDragEnabled
            isNestingEnabled
          />
    );
  }
}