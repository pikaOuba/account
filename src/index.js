import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import "./sass/style.scss";
import Reducer from "./reducers";

import App from "./App";

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
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
