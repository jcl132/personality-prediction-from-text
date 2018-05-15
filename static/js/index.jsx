import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import has from 'lodash';
import $ from 'jquery';
import 'whatwg-fetch'

import { hot } from 'react-hot-loader'


class App extends React.Component {
  // static propTypes = {
  // };

  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ['handleChange', 'handleSubmit']);

    this.state = {
      content: '',
      predictions: false,
    };
  }

  handleChange(e) {
		const content = e.target.value;
		this.setState({
			content: content,
		});
	}

  handleSubmit(e) {
		const { submitComment } = this.props;
		e.preventDefault();
		if (!this.state.content) {
		  return;
		}

    fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.content)
    }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
      this.setState({
        predictions: res.data,
      });
    }))


		this.setState({
			content: '',
		});
	}



  render() {

    const {
      predictions,
    } = this.state

    if (this.state.predictions != false) {

      var predictions_table = <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Trait</TableHeaderColumn>
            <TableHeaderColumn>Pred. Probability</TableHeaderColumn>
            <TableHeaderColumn>Pred. Category</TableHeaderColumn>
            <TableHeaderColumn>Pred. Score</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowColumn>Openness</TableRowColumn>
            <TableRowColumn>{predictions.pred_prob_cOPN}</TableRowColumn>
            <TableRowColumn>{predictions.pred_cOPN}</TableRowColumn>
            <TableRowColumn>{predictions.pred_sOPN}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Conscientiousness</TableRowColumn>
            <TableRowColumn>{predictions.pred_prob_cCON}</TableRowColumn>
            <TableRowColumn>{predictions.pred_cCON}</TableRowColumn>
            <TableRowColumn>{predictions.pred_sCON}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Extraversion</TableRowColumn>
            <TableRowColumn>{predictions.pred_prob_cEXT}</TableRowColumn>
            <TableRowColumn>{predictions.pred_cEXT}</TableRowColumn>
            <TableRowColumn>{predictions.pred_sEXT}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Agreeableness</TableRowColumn>
            <TableRowColumn>{predictions.pred_prob_cAGR}</TableRowColumn>
            <TableRowColumn>{predictions.pred_cAGR}</TableRowColumn>
            <TableRowColumn>{predictions.pred_sAGR}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Neuroticism</TableRowColumn>
            <TableRowColumn>{predictions.pred_prob_cNEU}</TableRowColumn>
            <TableRowColumn>{predictions.pred_cNEU}</TableRowColumn>
            <TableRowColumn>{predictions.pred_sNEU}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    }
    else {
      var predictions_table = null
    }

    return(
      <MuiThemeProvider>
        <h1>Personality Analyzer</h1>
        <div>
          <Tabs>
            <Tab label="My Personality">
            </Tab>
            <Tab label="My Network">
            </Tab>
            <Tab label="Text Predictior" >
              <div>
                <h2>Text Predictor</h2>
                <p>
                  Predict the personality of the author of a given piece of text.
                </p>
                <TextField hintText="Input Text"
                          multiLine={true}
                          floatingLabelText="Input Text"
                          onChange={this.handleChange}
                          value={this.state.content}/>
                <RaisedButton label="Predict" type="button" primary={true} onClick={this.handleSubmit}/>
                <div>
                  {predictions_table}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    )
  }
}
export default hot(module)(App)
ReactDOM.render(<App />, document.getElementById("content"));
