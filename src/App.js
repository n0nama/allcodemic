import React, { Component, Fragment } from 'react';
import { Resizable } from 're-resizable';
import './App.css';

import { Provider } from 'react-redux';
import { createStore } from "redux";

import FMNew from './components/FileManager/FMNew';

import FileManager from './components/FileManager/FileManager';
import Terminal from './components/Terminal/Terminal';
import Editor from './components/Editor/Editor';
import rootReducer from './reducers/root';

const store = createStore(rootReducer);

const history = [{ value: 'Welcome to the terminal!' }]

class App extends Component {
  render(){
    return (
      <Fragment>
      <Provider store={store}>
      <div id="App">
        <Resizable
          id="FileManagerWrapper"
          enable={{top:false, right:true, left:false, bottom:false}}
          defaultSize={{
            width: 250,
            height: '100%',
          }}
          maxWidth="600"
          minWidth="100"
        >
          <FileManager></FileManager>
          <div id="FMN">
            <FMNew></FMNew>
          </div>
        </Resizable>
        <div id="RightHalf">
          <Resizable
            id="EditorWrapper"
            enable={{top:false, right:false, left:false, bottom:true}}
            defaultSize={{
              width: '100%',
              height: window.innerHeight-300,
            }}
            maxHeight={(window.innerHeight-100).toString()}
            minHeight="300"
            bounds='parent'
            onResizeStop={this.EditorResize}
          >
            <Editor></Editor>
          </Resizable>
          <div id="TerminalWrapper">
            <Terminal history={history}></Terminal>
          </div>
        </div>
      </div>
      </Provider>
      </Fragment>
    )
  }
}

export default App;
