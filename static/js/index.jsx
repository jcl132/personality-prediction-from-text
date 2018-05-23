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
    _.bindAll(this, ["loadMyNetwork", 'requestCompare', 'loadMyPersonality']);

    this.state = {
      my_network: [],
      my_personality_data: null,
      compare_data: null,
    };
  }

  componentDidMount() {
    this.loadMyNetwork()
    this.loadMyPersonality()
  }

  requestCompare(person) {
    fetch("/compare", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      },
      body: JSON.stringify(person),
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

  loadMyPersonality() {
    fetch("/my_personality", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      },
    }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
      this.setState({
        my_personality_data: res.data,
      });
    }))
  }

  loadMyNetwork() {
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
            <Tabs>
              <Tab label="My Network">
                <MyNetwork 
                  my_network={this.state.my_network} 
                  my_personality_data={this.state.my_personality_data} 
                  requestCompare={this.requestCompare}
                  compare_data={this.state.compare_data}/>
              </Tab>
              <Tab label="My Personality">
                <MyPersonality my_personality_data={this.state.my_personality_data}/>
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
