import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';
import { createStore } from "redux";

import FileManager from './components/FileManager/FileManager';
import rootReducer from './reducers/root';

const store = createStore(rootReducer);

class App extends Component {
  render(){
    return (
      <Provider store={store}>
      <div className="App">
          <FileManager></FileManager>
      </div>
      </Provider>
    );
  }

}

export default App;
