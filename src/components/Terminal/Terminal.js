import React, { Component } from 'react';
import Terminal from 'react-bash';

import './Terminal.css';


class TerminalWindow extends Component {
    render(){
        return(
            <Terminal theme={Terminal.Themes.DARK}></Terminal>
        )
    }
}

export default TerminalWindow