import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import {curry} from 'ramda';

import { ContextMenuTrigger } from "react-contextmenu";

import RightClickMenu from './ContextMenu';

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import { openHideFolder } from '../../actions/FileManagerActions';

function hasChildren(node) {
    return (typeof node === 'object')
        && (typeof node.children !== 'undefined')
        && (node.children.length > 0);
}

const TreeAlg = {
    reduce: curry(function reduce(reducerFn, init, node) {
        const acc = reducerFn(init, node);
        if (!hasChildren(node)) {
            return acc;
        }   
        return node.children.reduce(TreeAlg.reduce(reducerFn), acc);
    }),
    map: curry(function map(mapFn, node) {
        const newNode = mapFn(node);
        if (hasChildren(node)) {
            return newNode;
        }
        newNode.children = node.children.map(TreeAlg.map(mapFn));
        return newNode;
    }),
};

// function flattenToArray(arr, {children, ...data}) {
//     return arr.concat([{...data}]);
// }

// function addChildCount(node) {
//     //const countstr = (hasChildren(node)) ? ` (${node.children.length})` : '';
//     return {
//       ...node
//     }
//   }
class Tree extends Component {
    fileDoubleClickHandler(file){
        this.props.createOrOpenNewFile(file);
    }
    caretClickHandler(path){
        this.props.openHideFolder(path);
    }
    rightClickMenu = (e,type) =>{
        e.preventDefault();
        this.setState({rightClickType: type})
    }
    render(){
        const data = this.props.tree;
        if (!data) return null;
        return(
            <div className="tree">
                
                {data.map((item) => {
                return (
                    <ContextMenuTrigger key={item.path} id={item.type + "RightClickMenu"}>                 
                    <Accordion>
                        <Accordion.Title
                            active={item.active}
                            index={0}
                            onDoubleClick={item.type === 'folder' ? () => this.caretClickHandler(item.path) : () => this.fileDoubleClickHandler(item)}
                            onContextMenu={(e) => this.rightClickMenu(e,item.type)}
                        >
                            {item.type === 'folder' ? <Icon name='dropdown' onClick={() => this.caretClickHandler(item.path)}/> : <Icon />}
                            <span>
                                <Icon name={`${item.type}`} />{item.name}
                            </span>
                        </Accordion.Title>
                        <Accordion.Content active={item.active}>
                            <Tree
                                tree={item.children}
                                openHideFolder={this.props.openHideFolder}
                                createOrOpenNewFile={this.props.createOrOpenNewFile}
                            />
                        </Accordion.Content>
                    </Accordion>
                    </ContextMenuTrigger>
                )
                })}
                <RightClickMenu />                
            </div>
        )
    }
}

export default Tree