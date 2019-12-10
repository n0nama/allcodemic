import React, { Component, Fragment } from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

class RightClickMenu extends Component{
    render(){
        return (
            <Fragment>
            <ContextMenu id="folderRightClickMenu" className="ui segment">
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                Create New File
            </MenuItem> 
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                Copy
            </MenuItem>
            <MenuItem divider />
                <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                    Paste
                </MenuItem>
            </ContextMenu>

            <ContextMenu id="fileRightClickMenu" className="ui segment"> 
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                Copy
            </MenuItem>
            <MenuItem divider />
                <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                    Paste
                </MenuItem>
            </ContextMenu>
            </Fragment>
        )
    }
}

export default RightClickMenu