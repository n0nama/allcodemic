import React, { Component } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext
} from 'react-beautiful-dnd';
import { getBox } from 'css-box-model';
import { calculateFinalDropPositions } from './Tree-utils';
//import { Props, State, DragState } from './Tree-types';
import { noop } from './utils/handy';
import { flattenTree, mutateTree } from './utils/tree';
//import { FlattenedItem, ItemId, Path, TreeData } from '../../types';
import TreeItem from './TreeItem';
import {
  getDestinationPath,
  getItemById,
  getIndexById,
} from './utils/flat-tree';
import DelayedFunction from './utils/delayed-function';

const itemsElement = {}

export default class Tree extends Component {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
    offsetPerLevel: 15,
    isDragEnabled: false,
    isNestingEnabled: false,
  };

  state = {
    flattenedTree: [],
    draggedItemId: undefined,
  };

  // State of dragging.
//   dragState?: DragState;

//   // HTMLElement for each rendered item
//   itemsElement: Record<ItemId, HTMLElement | undefined> = {};

//   // HTMLElement of the container element
//   containerElement: HTMLElement | undefined;

  expandTimer = new DelayedFunction(300);

  static getDerivedStateFromProps(props, state) {
    const { draggedItemId } = state;
    const { tree } = props;
    const finalTree = Tree.closeParentIfNeeded(tree, draggedItemId);
    const flattenedTree = flattenTree(finalTree);

    return {
      ...state,
      flattenedTree,
    };
  }

  static closeParentIfNeeded(tree, draggedItemId) {
    if (draggedItemId) {
      // Closing parent internally during dragging, because visually we can only move one item not a subtree
      return mutateTree(tree, draggedItemId, {
        isExpanded: false,
      });
    }
    return tree;
  }

  onDragStart = (result) => {
    const { onDragStart } = this.props;
    const item = getItemById(
      this.state.flattenedTree,
      result.draggableId,
    );
    this.dragState = {
      source: result.source,
      destination: result.source,
      mode: result.mode,
    };
    this.setState({
      draggedItemId: result.draggableId,
      type:item.item.type
    });
    if (onDragStart) {
      onDragStart(result.draggableId);
    }
  };

  onDragUpdate = (update) => {
    console.log("Update", update)
    const { onExpand } = this.props;
    const { flattenedTree } = this.state;
    if (!this.dragState) {
      return;
    }

    this.expandTimer.stop();
    if (update.combine) {
      const { draggableId } = update.combine;
      const item = getItemById(
        flattenedTree,
        draggableId,
      );
      if (item && this.isExpandable(item)) {
        this.expandTimer.start(() => onExpand(draggableId, item.path));
      };
    }
    this.dragState = {
      ...this.dragState,
      destination: update.destination,
      combine:  update.combine
    };
  };

  onDropAnimating = () => {
    this.expandTimer.stop();
  };

  onDragEnd = (result) => {
    const { onDragEnd, tree } = this.props;
    const { flattenedTree } = this.state;
    this.expandTimer.stop();

    const finalDragState = {
      ...this.dragState,
      source: result.source,
      destination: result.destination,
      combine: result.combine,
    };

    this.setState({
      draggedItemId: undefined,
    });

    const { sourcePosition, destinationPosition } = calculateFinalDropPositions(
      tree,
      flattenedTree,
      finalDragState,
    );

    onDragEnd(sourcePosition, destinationPosition);

    this.dragState = undefined;
  };

  onPointerMove = () => {
    if (this.dragState) {
      this.dragState = {
        ...this.dragState,
        horizontalLevel: this.getDroppedLevel(),
      };
    }
  };

  calculateEffectivePath = (flatItem,snapshot) => {
    const { flattenedTree, draggedItemId } = this.state;

    if (
      this.dragState &&
      draggedItemId === flatItem.item.id &&
      (this.dragState.destination || this.dragState.combine)
    ) {
      const {
        source,
        destination,
        combine,
        horizontalLevel,
        mode,
      } = this.dragState;
      // We only update the path when it's dragged by keyboard or drop is animated
      if (mode === 'SNAP' || snapshot.isDropAnimating) {
        if (destination) {
          // Between two items
          return getDestinationPath(
            flattenedTree,
            source.index,
            destination.index,
            horizontalLevel,
          );
        }
        if (combine) {
          // Hover on other item while dragging
          return getDestinationPath(
            flattenedTree,
            source.index,
            getIndexById(flattenedTree, combine.draggableId),
            horizontalLevel,
          );
        }
      }
    }
    return flatItem.path;
  };

  isExpandable = (item) =>
    item.item.hasChildren && !item.item.isExpanded;

  getDroppedLevel = () => {
    const { offsetPerLevel } = this.props;
    const { draggedItemId } = this.state;

    if (!this.dragState || !this.containerElement) {
      return undefined;
    }

    const containerLeft = getBox(this.containerElement).contentBox.left;
    const itemElement = itemsElement[draggedItemId];

    if (itemElement) {
      const currentLeft = getBox(itemElement).contentBox.left;
      const relativeLeft = Math.max(currentLeft - containerLeft, 0);
      return (
        Math.floor((relativeLeft + offsetPerLevel / 2) / offsetPerLevel) + 1
      );
    }

    return undefined;
  };

  patchDroppableProvided = (provided) => {
    return {
      ...provided,
      innerRef: (el) => {
        this.containerElement = el;
        provided.innerRef(el);
      },
    };
  };

  setItemRef = (itemId, el) => {
    if (el) {
      itemsElement[itemId] = el;
    }
  };

  renderItems = () => {
    const { flattenedTree } = this.state;
    return flattenedTree.map(this.renderItem);
  };

  renderItem = (flatItem, index) => {
    const { isDragEnabled } = this.props;

    return (
      <Draggable
        key={flatItem.item.id}
        draggableId={flatItem.item.id.toString()}
        index={index}
        isDragDisabled={!isDragEnabled}
      >
        {this.renderDraggableItem(flatItem)}
      </Draggable>
    );
  };

  renderDraggableItem = (flatItem) => (provided,snapshot) => {
    const { renderItem, onExpand, onCollapse, offsetPerLevel } = this.props;

    const currentPath = this.calculateEffectivePath(flatItem, snapshot);
    if (snapshot.isDropAnimating) {
      this.onDropAnimating();
    }
    return (
      <TreeItem
        key={flatItem.item.id}
        item={flatItem.item}
        type={flatItem.item.type}
        path={currentPath}
        onExpand={onExpand}
        onCollapse={onCollapse}
        renderItem={renderItem}
        provided={provided}
        snapshot={snapshot}
        itemRef={this.setItemRef}
        offsetPerLevel={offsetPerLevel}
        style={snapshot.isDraggingOver ? { border: '1px solid white' } : null}
      />
    );
  };

  render() {
    const { isNestingEnabled } = this.props;
    const renderedItems = this.renderItems();
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable
          droppableId="tree"
          isCombineEnabled={this.state.type !== "file"}
          ignoreContainerClipping
        >
          {(provided, snapshot) => {
            const finalProvided = this.patchDroppableProvided(
              provided,
            );
            return (
              <div
                ref={finalProvided.innerRef}
                onTouchMove={this.onPointerMove}
                onMouseMove={this.onPointerMove}
                {...finalProvided.droppableProps}
              >
                {renderedItems}
                {finalProvided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  }
}
