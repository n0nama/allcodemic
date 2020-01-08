import React, { Component } from 'react';
import './FileManager.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createOrOpenNewFile } from '../../actions/EditorActions';

import Tree from './Tree/Tree';
import { mutateTree, moveItemOnTree } from './Tree/utils/tree';
import { Icon } from 'semantic-ui-react';

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

class FileManager extends Component {
  state = {
    tree: this.props.tree,
  };

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
        <div id="FileManager">
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onDragEnd={this.onDragEnd}
            isDragEnabled
            isNestingEnabled
          />
        </div>
    );
  }
}

function mapStateToProps(state){
    return {
        tree : state.tree
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ createOrOpenNewFile}, dispatch);

}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);