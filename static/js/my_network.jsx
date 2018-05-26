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
import 'whatwg-fetch'

import { hot } from 'react-hot-loader'

import PersonCard from './person_card'


export default class MyNetwork extends React.Component {
  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ["requestCompare"]);
  }

  requestCompare(person) {
    this.props.requestCompare(person)
  }

  render() {
    const { my_network, my_personality_data, compare_data } = this.props;

    var my_network_rows = []
    my_network.map((person) => {
        if (person == undefined || person.avg_status_predictions == undefined || person.pred_percentiles == undefined) {
          console.log('UNDEFINED PERSON')
        }
        else {
            my_network_rows.push(<PersonCard 
                key={person.name} 
                person={person} 
                my_personality={false} 
                my_personality_data={my_personality_data}
                requestCompare={this.requestCompare}
                compare_data={compare_data}/>)
        }
      }
    )
    // my_network_rows = my_network_rows.slice(0, 50)

    return(
      <div style={{marginLeft: 30, marginRight: 30}}>
        {my_network_rows}
      </div>
    )
  }
  }
