import React, { Component, Fragment } from 'react';
import './FileManager.css';

import Tree from './TreeComponent';
import Editor from '../Editor/Editor';

const menu = [{
    type: 'folder',
    text: 'base',
    active : true,
    children: [
        {
            type: 'file',
            text: 'test.py',
        },
        {
            type:     'folder',
            text:     'env',
            active : true,
            children: [
                {
                    type: 'file',
                    text: 'bin.bash',
                },
                {
                    type: 'file',
                    text: 'python.script',
                },
                {
                    type: 'file',
                    text: 'temp.log',
                },
            ]
        },
        {
            type: 'folder',
            text: 'Poems',
            active : false,
        },
        {
            type: 'folder',
            text: 'Essays',
            active : false,
            children: [
                {
                    type: 'file',
                    text: 'The Fantastic Imagination',
                },
                {
                    type: 'file',
                    text: 'The New Name',
                },
            ]
        },
        {
            type: 'file',
            text: 'Our Community',
        },
        {
            type: 'folder',
            text: 'About us',
            active : false,
            children: [
                {
                    type: 'folder',
                    text: 'Community sponsorship',
                    children: [
                        {
                            type: 'file',
                            text: 'Our Patreon',
                        },
                        {
                            type: 'file',
                            text: 'Endowments',
                        },
                    ]
                },
            ]
        },
    ]
},
{
    type: 'file',
    text: 'Forum',
},
];

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
        return (
            <Fragment>
            <div id="FileManager"
                style={{width : this.state.width.toString() + 'px'}}
                onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                <Tree data={menu}/>
            </div>
            <div id="VerticalLine" style={{marginLeft : this.state.width.toString() + 'px'}} onMouseDown={(e) => this.startResize(e)} onMouseUp={(e) => this.stopResize(e)}></div>
            <div id="EditorWrapper" style={{left : (this.state.width + 2).toString() + 'px'}} onMouseMove={this.state.isDragging ? (e)=>this.onMouseMove(e) : null}>
                <Editor></Editor>
            </div>
            </Fragment>
        )
    }
}

export default FileManager;