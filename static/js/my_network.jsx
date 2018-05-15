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
import has from 'lodash';
import $ from 'jquery';
import 'whatwg-fetch'

import { hot } from 'react-hot-loader'


export default class MyNetwork extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { my_network } = this.props;

    var my_network_rows = []
    my_network.map((person) => {
        if (person.avg_status_predictions == undefined) {
          console.log('huh?')
        }
        else {
          my_network_rows.push(
              <TableRow selectable={false} key={person.name}>
                <TableRowColumn>{person.name}</TableRowColumn>
                <TableRowColumn>{person.url}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_prob_cOPN}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_prob_cCON}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_prob_cEXT}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_prob_cAGR}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_prob_cNEU}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_sOPN}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_sCON}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_sEXT}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_sAGR}</TableRowColumn>
                <TableRowColumn>{person.avg_status_predictions.avg_pred_sNEU}</TableRowColumn>
              </TableRow>
          )
        }
      }
    )

    return(
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>FB URL</TableHeaderColumn>
              <TableHeaderColumn>Pred. Score Openness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Score Conscientiousness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Score Extraversion</TableHeaderColumn>
              <TableHeaderColumn>Pred. Score Agreeableness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Score Neuroticism</TableHeaderColumn>
              <TableHeaderColumn>Pred. Prob. Openness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Prob. Conscientiousness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Prob. Extraversion</TableHeaderColumn>
              <TableHeaderColumn>Pred. Prob. Agreeableness</TableHeaderColumn>
              <TableHeaderColumn>Pred. Prob. Neuroticism</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {my_network_rows}
          </TableBody>
        </Table>
      </div>
    )
  }
  }
