import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import has from 'lodash';
import 'whatwg-fetch'

import { hot } from 'react-hot-loader'

import TextPredictor from './text_predictor'
import MyNetwork from './my_network'

class App extends React.Component {
  // static propTypes = {
  // };

  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ['load_my_network']);

    this.state = {
      my_network: [],
    };
  }

  componentDidMount() {
    this.load_my_network()
  }

  load_my_network() {
    fetch('/my_network', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
      console.log(res.data[0])
      this.setState({
        my_network: res.data,
      });
    }))
  }

  render() {

    return(
      <MuiThemeProvider>
        <div>
          <h1>Personality Analyzer</h1>
          <div>
            <Tabs>
              <Tab label="My Network">
                <MyNetwork my_network={this.state.my_network}/>
              </Tab>
              <Tab label="My Personality">
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
