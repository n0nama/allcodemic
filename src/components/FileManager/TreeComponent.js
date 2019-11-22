import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import {curry} from 'ramda';

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
    render(){
        const data = this.props.data;
        if (!data) return null;
        //console.log(TreeAlg.map(addChildCount, menu));
        return(
            <div id="tree">
                {data.map((item) => {
                return (
                    <Accordion key={item.text}>
                        <Accordion.Title
                            active={item.active ? item.active : false}
                            index={0}
                        >
                            {item.type === 'folder' ? <Icon name='dropdown' /> : <Icon />}
                            <span>
                                <Icon name={`${item.type} outline`} />{item.text}
                            </span>
                        </Accordion.Title>
                        <Accordion.Content active={item.active ? item.active : false}>
                            <Tree data={item.children} />
                        </Accordion.Content>
                    </Accordion>
                    // <div className="tree-item" >
                    //     {item.type == 'folder' ? <div className="item-caret"><Icon name='angle right' size="small" /></div>:null}
                    //     <div className="item-base"><Icon name={`${item.type} outline`} /></div>
                        
                    // </div>
                )
                })}
            </div>
        )
    }
}

export default Tree