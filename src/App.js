import React, { PureComponent } from 'react';
import { Resizable } from 're-resizable';
import './App.css';

import { Provider } from 'react-redux';
import { createStore } from "redux";

import FileManager from './components/FileManager/FileManager';
import TerminalWindow from './components/Terminal/Terminal';
import Editor from './components/Editor/Editor';
import rootReducer from './reducers/root';

const store = createStore(rootReducer);

class App extends PureComponent {
  render(){
    return (
      <Provider store={store}>
      <div id="App">
        <Resizable
          id="FileManagerWrapper"
          defaultSize={{
            width: 300,
            height: '100%',
          }}
          maxWidth="600"
          minWidth="100"
        >
          <FileManager></FileManager>
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
          >
            <Editor></Editor>
          </Resizable>
          <div id="TerminalWrapper">
            <TerminalWindow></TerminalWindow>
          </div>
        </div>
      </div>
      </Provider>
    )
  }
}

export default App;
