import React from 'react';
import logo from './logo.svg';
import './App.css';
import CSS from "csstype";
import {BasicPyramidSolitaire} from "./BasicPyramidSolitaire";
import {PyramidSolitaireVisualView} from "./PyramidSolitaireVisualView";
import {PyramidSolitaireVisualController} from "./PyramidSolitaireVisualController";

class App extends React.Component<{ }, { }> {

  componentDidMount() {
    const canvas = document.getElementById("myCanvas");
    const removeButton = document.getElementById("removeButton");
    const rulesButton = document.getElementById("rulesButton");
    // creates the model for the game
    const model: BasicPyramidSolitaire = new BasicPyramidSolitaire();
    // creates the view for the game
    const view: PyramidSolitaireVisualView = new PyramidSolitaireVisualView(canvas, removeButton, rulesButton);
    // creates the controller for the game
    const visualController: PyramidSolitaireVisualController = new PyramidSolitaireVisualController(view, model);
    visualController.playGame(model.getDeck(), false, 7, 3);

  }

  render() {
    const cnvStyle : CSS.Properties = {
      border:"1px solid #942222",
      marginTop: "0.5em"
    }
    const rmvButtonStyle : CSS.Properties = {
      marginTop: "0.5em",
      marginLeft: "12.0em",
      backgroundColor: "#013e04",
      color: "white",
      fontSize: "18px",
      fontFamily: "veranda"
    }
    const rulesButtonStyle : CSS.Properties = {
      marginTop: "0.5em",
      marginLeft: "0.5em",
      backgroundColor: "#013e04",
      color: "white",
      fontSize: "18px",
      fontFamily: "veranda"
    }
    return (<div>

      <header>
        <button type="button" id = "removeButton" style={rmvButtonStyle}>Remove Selected</button>
        <button type="button" id = "rulesButton" style={rulesButtonStyle}>Rules</button>
      </header>
      <canvas id="myCanvas" width="700" height="800" style = {cnvStyle}>
      </canvas>
    </div>);
  }
}

export default App;
