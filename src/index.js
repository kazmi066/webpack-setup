import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
require("file-loader?name=[name].[ext]!./index.html");

const appElement = document.getElementById("app");
ReactDOM.render(<App />, appElement);
