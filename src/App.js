import React, { PureComponent } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';
import { createStore } from "redux";

import FileManager from './components/FileManager/FileManager';
import TerminalWindow from './components/Terminal/Terminal';
import Editor from './components/Editor/Editor';
import rootReducer from './reducers/root';

const store = createStore(rootReducer);

class App extends PureComponent {
  state = {
    vSize : 300,
    hSize : 300,
    resizingV : false,
    resizingH : false,
  }
  startResizeV = () => {
    this.setState({resizingV : true});
    console.log('Start resizing');
  }
  stopResize = () => {
    if(this.state.resizingV && !this.state.resizingH){
      this.setState({resizingV : false})
    } else if(!this.state.resizingV && this.state.resizingH){
      this.setState({resizingH : false})
    }
    console.log('Stop resizing');
  }
  startResizeH = () => {
    this.setState({resizingH : true});
    console.log('Start resizing');
  }
  resizeHandler = e => {
    e.preventDefault()
    if(this.state.resizingV && !this.state.resizingH){
      this.setState({vSize : e.clientX+1})
    } else if(!this.state.resizingV && this.state.resizingH){
      this.setState({hSize : window.innerHeight - e.clientY + 1})
    }
  }
  render(){
    return (
      <Provider store={store}>
      <div id="App" onMouseMove={this.resizeHandler} onMouseUp={this.stopResize}>
        <div id="FileManagerWrapper" style={{width : this.state.vSize + 'px'}}>
          <FileManager></FileManager>
          <span id="VerticalResizer" style={{left : this.state.vSize-2 + 'px'}} onMouseDown={this.startResizeV}></span>
        </div>
        <div id="EditorWrapper" style={{left : this.state.vSize + 'px', bottom : this.state.hSize + 'px'}}>
          <Editor height={this.state.hSize}></Editor>
          <span id="HorizontalResizer" onMouseDown={this.startResizeH}></span>
        </div>
        <div id="TerminalWrapper" style={{left : this.state.vSize + 'px', height : this.state.hSize}}>
          <TerminalWindow></TerminalWindow>
        </div>
      </div>
      </Provider>
    )
  }
}

export default App;
