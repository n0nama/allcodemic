import React, { Component, Fragment } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './Editor.css'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { activeFile, closeFile, createOrOpenNewFile, reorderOpenedFiles } from '../../actions/EditorActions';

class Editor extends Component {
    state = {
        minHeight : 100,
        maxHeight : 600,
        height : 300,
        isDragging : false,
        originalHeight : window.innerHeight - 322,
        content : ""
    }
    startResize(e) {
        this.setState({ isDragging: true});
    }
    stopResize(e) {
        this.setState({ isDragging: false});
    }
    onMouseMove(e) {
        //console.log(this.state);
        if(window.innerHeight - e.clientY >= this.state.maxHeight){
            this.stopResize();
            this.setState({ height: this.state.maxHeight});
        } else if (window.innerHeight - e.clientY <= this.state.minHeight){
            this.stopResize();
            this.setState({ height: this.state.minHeight});
        } else {
            let changedHeight = window.innerHeight - e.clientY;
            let origHeight = window.innerHeight - changedHeight - 22;
            this.setState({ height : changedHeight, originalHeight : origHeight});
        }
    }
    activeHandler(path){
        this.props.activeFile(path);
    }
    closeFile(path){
        this.props.closeFile(path);
        let activeFile = this.props.files.filter(f=>f.active === true);
        this.setState({content : activeFile[0].content });
    }
    onDragEnd = result =>{
        const {destination, source, draggableId} = result;
        if(!destination){
            return;
        }
        if(destination.draggableId === source.droppableId && 
            destination.index === source.index){
                return;
        }
        let oldState = this.props.files;
        const draggableFile = this.props.files.filter(f=>f.path===draggableId);
        oldState.splice(source.index, 1);
        oldState.splice(destination.index, 0, draggableFile[0]);
        this.props.reorderOpenedFiles(oldState);

    }
    createNewFile(path){
        this.props.createOrOpenNewFile(path);
    }
    componentDidMount(){
        let activeFile = this.props.files.filter(f=>f.active === true);
        this.setState({content : activeFile[0].content })
    }
    onChange(newValue) {
        console.log("change", newValue);
    }
    render(){
        console.log(this.props)
        return (
            <Fragment>
                <Button id="newFileButton" inverted basic size='mini'  onClick={()=>this.createNewFile()}>
                    <Icon name='plus'></Icon>
                </Button>
                <DragDropContext onDragEnd={this.onDragEnd}>
                <div id="EditorTabs">
                    <Droppable droppableId={"droppableEditorTabs"} direction="horizontal">
                        {provided =>{
                            return (
                            <div 
                                className="ui mini top attached tabular menu"
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {this.props.files.map((f, index)=>{
                                    return (
                                        <Draggable
                                            key={f.path}
                                            draggableId={f.path}
                                            index={index}
                                        >
                                            {provided=>{
                                                return(
                                                    <div
                                                        ref={provided.innerRef}
                                                        className={f.active ? "active item" : "item"}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <span onClick={() => this.activeHandler(f.path)}>{f.name}</span>
                                                    <Icon name='close' onClick={()=>this.closeFile(f.path)}></Icon>
                                                    </div>
                                                )
                                            }}
                                        </Draggable>
                                    )
                                })}
                                <div className="item" style={{display: 'none'}}>{provided.placeholder}</div>
                            </div>
                            )
                        }}
                    </Droppable>
                </div>
                </DragDropContext>
                <div id="Editor"
                    style={{bottom : (this.state.height + 2).toString() + 'px'}}
                    onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                        {this.props.files.map(f=>{
                            return (
                                <div key={f.path + '1'} className={f.active ? "editorHider active" : "editorHider"}>
                                    <AceEditor
                                        mode="python"
                                        theme="monokai"
                                        fontSize={14}
                                        height={this.state.originalHeight.toString() + 'px'}
                                        width="100%"
                                        onChange={this.onChange}
                                        name="mainEditor"
                                        editorProps={{ $blockScrolling: true }}
                                        value={f.content}
                                    />
                                </div>
                            )
                        })}
                </div>
                <div id="HorizontalLine"
                    style={{bottom : this.state.height.toString() + 'px'}}
                    onMouseDown={(e) => this.startResize(e)}
                    onMouseUp={(e) => this.stopResize(e)}>
                </div>
                <div id="TerminalWrapper"
                    style={{height : this.state.height.toString() + 'px'}}
                    onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}
                    onMouseUp={(e) => this.stopResize(e)}>
                </div>
            </Fragment>
            
        )
    }
}
function mapStateToProps(state){
    return {
        files : state.files
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({activeFile, closeFile, createOrOpenNewFile, reorderOpenedFiles}, dispatch);

}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);