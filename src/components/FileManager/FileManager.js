import React, { Component } from 'react';
import './FileManager.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openHideFolder } from '../../actions/FileManagerActions';
import { createOrOpenNewFile } from '../../actions/EditorActions';

import Tree from './TreeComponent';

class FileManager extends Component {
    render(){
        return (
            <div id="FileManager">
                <Tree tree={this.props.tree} openHideFolder={this.props.openHideFolder} createOrOpenNewFile={this.props.createOrOpenNewFile}/>
            </div>
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