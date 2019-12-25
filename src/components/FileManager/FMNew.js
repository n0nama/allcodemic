import React, { Component } from 'react';
//import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import Tree from './Tree/Tree';
import { mutateTree, moveItemOnTree } from './Tree/utils/tree';
import { Icon } from 'semantic-ui-react';

const complexTree = {
  rootId: '1',
  items: {
    '1': {
      id: '1',
      children: ['1-1', '1-2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        name: 'root',
      },
    },
    '1-1': {
      id: '1-1',
      children: ['1-1-1', '1-1-2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        name: 'First parent',
        type: 'folder'
      },
    },
    '1-2': {
      id: '1-2',
      children: ['1-2-1', '1-2-2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        name: 'Second parent',
        type: 'folder'
      },
    },
    '1-1-1': {
      id: '1-1-1',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        name: 'Child one',
        type: 'file'
      },
    },
    '1-1-2': {
      id: '1-1-2',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        name: 'Child two',
        type: 'file'
      },
    },
    '1-2-1': {
      id: '1-2-1',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        name: 'Child three',
        type: 'file'
      },
    },
    '1-2-2': {
      id: '1-2-2',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        name: 'Child four',
        type: 'file'
      },
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
    tree: complexTree,
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
      <div className={"item " + item.data.type}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        {getIcon(item, onExpand, onCollapse)}
        {item.data ? item.data.name : ''}
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