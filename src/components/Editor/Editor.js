import React, { Component, Fragment } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './Editor.css'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { activeFile, closeFile, createOrOpenNewFile, reorderOpenedFiles } from '../../actions/EditorActions';

class Editor extends Component {
    state = {
        content : ""
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
                <div id="Editor">
                        {this.props.files.map(f=>{
                            return (
                                <div key={f.path + '1'} className={f.active ? "editorHider active" : "editorHider"}>
                                    <AceEditor
                                        mode="python"
                                        theme="tomorrow_night_eighties"
                                        fontSize={14}
                                        onChange={this.onChange}
                                        name="mainEditor"
                                        editorProps={{ $blockScrolling: true }}
                                        value={f.content}
                                        height="100%"
                                    />
                                </div>
                            )
                        })}
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