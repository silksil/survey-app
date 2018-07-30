import 'materialize-css/dist/css/materialize.min.css'
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux'; //links react and redux
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk'

import App from './components/App';
import reducers from './reducers';
import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
// first arg. includes reducer, second arg. the initial state, third arg. middleware

ReactDom.render(

  <Provider store={store}><App /></Provider>,
    /* Provider knows how to read changes from redux store and if state changes, all components are updated */
    document.querySelector('#root')
);
