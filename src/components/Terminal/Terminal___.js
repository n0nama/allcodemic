import React, { Component } from 'react';
import Terminal from './Terminal';

import './Terminal.css';

const history = [{ value: 'Welcome to the terminal!' }]

class TerminalWindow extends Component {
    render(){
        return(
            <Terminal history={history}></Terminal>
        )
    }
}

export default TerminalWindow