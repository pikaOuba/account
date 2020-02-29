import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import Reducer from "./reducers";

import App from "./App";

import "./sass/style.scss";

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');


const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["tabs", "addActiveKey", "login"]
};
const persistedReducer = persistReducer(persistConfig, Reducer);
let store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LocaleProvider locale={zh_CN}>
        <App />
      </LocaleProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
