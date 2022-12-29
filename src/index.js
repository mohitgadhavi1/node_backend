import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { StyleProvider } from "@ant-design/cssinjs";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider hashPriority="high">
        <App />
      </StyleProvider>
    </Provider>
  </React.StrictMode>
);
