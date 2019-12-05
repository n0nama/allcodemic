import React, { Component, Fragment } from 'react';
import './FileManager.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openHideFolder } from '../../actions/FileManagerActions';
import { createOrOpenNewFile } from '../../actions/EditorActions';

import Tree from './TreeComponent';
import Editor from '../Editor/Editor';

class FileManager extends Component {
    state = {
        minWidth : 100,
        maxWidth : 600,
        width : 300,
        isDragging : false
    }
    startResize(e) {
        this.setState({ isDragging: true});
    }
    stopResize() {
        this.setState({ isDragging: false});
    }
    onMouseMove(e) {
        if(e.clientX >= this.state.maxWidth){
            this.stopResize();
            this.setState({ width: this.state.maxWidth});
        } else if (e.clientX <= this.state.minWidth){
            this.stopResize();
            this.setState({ width: this.state.minWidth});
        } else {
            this.setState({ width: e.clientX});
        }
    }
    render(){
        console.log("PROPS", this.props)
        return (
            <Fragment>
            <div id="FileManager"
                style={{width : this.state.width.toString() + 'px'}}
                onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                <Tree tree={this.props.tree} openHideFolder={this.props.openHideFolder} createOrOpenNewFile={this.props.createOrOpenNewFile}/>
            </div>
            <div id="VerticalLine" style={{marginLeft : this.state.width.toString() + 'px'}} onMouseDown={(e) => this.startResize(e)} onMouseUp={(e) => this.stopResize(e)}></div>
            <div id="EditorWrapper" style={{left : (this.state.width + 2).toString() + 'px'}} onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                <Editor></Editor>
            </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state){
    return {
        tree : state.tree
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({openHideFolder, createOrOpenNewFile}, dispatch);

}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);