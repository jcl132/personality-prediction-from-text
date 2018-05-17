import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";
import has from 'lodash';
import 'whatwg-fetch'

import { hot } from 'react-hot-loader'


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

import TextPredictor from './text_predictor'
import MyNetwork from './my_network'
import MyPersonality from './my_personality'

class App extends React.Component {
  // static propTypes = {
  // };

  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ["load_my_network"]);

    this.state = {
      my_network: [],
    };
  }

  componentDidMount() {
    this.load_my_network()
  }

  load_my_network() {
    fetch("/my_network", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
      this.setState({
        my_network: res.data,
      });
    }))
  }


  render() {
    const container_style = {
      // padding: 30,
    }

    const title_style = {
      margin: 15
    }

    const tab_container_style = {
      margin: 20
    }

    return(
      <MuiThemeProvider>
        <div style={container_style}>
          <AppBar
            title="Personality Analyzer"/>
          <div>
            <Tabs secondary={true}>
              <Tab label="My Personality">
                <MyPersonality />
              </Tab>
              <Tab label="My Network">
                <MyNetwork my_network={this.state.my_network}/>
              </Tab>
              <Tab label="Text Predictor" >
                <TextPredictor />
              </Tab>
            </Tabs>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
export default hot(module)(App)
