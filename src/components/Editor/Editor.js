import React, { Component, Fragment } from 'react';
import './Editor.css'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";


class Editor extends Component {
    state = {
        minHeight : 100,
        maxHeight : 600,
        height : 300,
        isDragging : false,
        originalHeight : window.innerHeight - 322
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
    onChange(newValue) {
        console.log("change", newValue);
    }
    render(){
        return (
            <Fragment>
                <div id="EditorTabs">Editor</div>
                <div id="Editor"
                    style={{bottom : (this.state.height + 2).toString() + 'px'}}
                    onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                    <AceEditor
                        mode="python"
                        theme="monokai"
                        fontSize={14}
                        height={this.state.originalHeight.toString() + 'px'}
                        width="100%"
                        onChange={this.onChange}
                        name="UNIQUE_ID_OF_DIV"
                        editorProps={{ $blockScrolling: true }}
                    />
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

export default Editor