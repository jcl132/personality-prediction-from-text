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

import PersonCard from './person_card'


export default class MyNetwork extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { my_network } = this.props;

    var my_network_rows = []
    my_network.map((person) => {
        if (person == undefined || person.avg_status_predictions == undefined || person.pred_percentiles == undefined) {
          console.log('UNDEFINED PERSON')
        }
        else {
            my_network_rows.push(<PersonCard key={person.name} person={person} />)
        }
      }
    )
    // my_network_rows = my_network_rows.slice(0, 20)

    return(
      <div>
        {my_network_rows}
      </div>
    )
  }
  }
