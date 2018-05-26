import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';

export default class Compare extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    _.bindAll(this, ["round_scores", "round_percs", "annonymizeNames"]);


	}

	annonymizeNames(string) {
	    var names = string.split(' '),
	        initials = names[0].substring(0, 1).toUpperCase().concat('.');
	    
	    if (names.length > 1) {
	        initials += names[names.length - 1].substring(0, 1).toUpperCase().concat('.');
	    }
	    return initials;
	    console.log(getInitials('FirstName LastName'));
	};

	round_scores(number) {
		return Math.round(number * 100)/100
	}

	round_percs(number) {
		return Math.round(number)
	}


	render() {

		const { personA, personB, compare_data } = this.props;

		const items_style = {
			display: 'flex',
			justifyContent: 'space-around'
		}

		const plot_img_style = {
	    	position: 'relative',
	    	height: '40%',
	    	// width: '85%'
	    }

	    const element_style = {
	    	display: 'inline-flex',
	    	flexDirection: 'column',
	    	alignItems: 'center',
	    	marginLeft: 'auto'
	    }

	    const row_style = {
	    	fontSize: 15,
	    }

	    const table_style = {
	    	width: '60%',
	    	position: 'relative',
	    	marginLeft: 'auto',
	    	// float: 'right',
	    }

		if (personA == null || personB == null) {
			var elements = null
		}
		else {

			const opn_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>O</span>) Openness</TableRowColumn>
		    const con_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>C</span>) Conscientiousness</TableRowColumn>
		    const ext_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>E</span>) Extraversion</TableRowColumn>
		    const agr_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>A</span>) Agreeableness</TableRowColumn>
		    const neu_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>N</span>) Neuroticism</TableRowColumn>

			var percentiles = []
			var scores = []

			for (var trait in personA.actual_personality_scores['percentiles']) {
		    	var val = personA.actual_personality_scores['percentiles'][trait]
		    	if (trait == 'O_perc') {
			    	percentiles.push(
			    				<TableRow>
				    				{opn_row}
				    				<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sOPN)}</TableRowColumn>
							    	
							    	<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sOPN) - this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'C_perc') {
			    	percentiles.push(
			    				<TableRow>
				    				{con_row}
				    				<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sCON)}</TableRowColumn>
							    	
							    	<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sCON) - this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'E_perc') {
			    	percentiles.push(
			    				<TableRow>
				    				{ext_row}
				    				<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sEXT)}</TableRowColumn>
							    	
							    	<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sEXT) - this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'A_perc') {
			    	percentiles.push(
			    				<TableRow>
				    				{agr_row}
				    				<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sAGR)}</TableRowColumn>
							    	
							    	<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sAGR) - this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'N_perc') {
			    	percentiles.push(
			    				<TableRow>
				    				{neu_row}
				    				<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sNEU)}</TableRowColumn>
							    	
							    	<TableRowColumn style={row_style}>{this.round_percs(personB.pred_percentiles.pred_perc_sNEU) - this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
		    }

		    for (var trait in personA.actual_personality_scores['scores']) {
		    	var val = personA.actual_personality_scores['scores'][trait]
		    	if (trait == 'O_score') {
			    	scores.push(
			    				<TableRow>
				    				{opn_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(personB.avg_status_predictions.avg_pred_sOPN)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(this.round_scores(personB.avg_status_predictions.avg_pred_sOPN) - this.round_scores(val))}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'C_score') {
			    	scores.push(
			    				<TableRow>
				    				{con_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(personB.avg_status_predictions.avg_pred_sCON)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(this.round_scores(personB.avg_status_predictions.avg_pred_sCON) - this.round_scores(val))}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'E_score') {
			    	scores.push(
			    				<TableRow>
				    				{ext_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(personB.avg_status_predictions.avg_pred_sEXT)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(this.round_scores(personB.avg_status_predictions.avg_pred_sEXT) - this.round_scores(val))}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'A_score') {
			    	scores.push(
			    				<TableRow>
				    				{agr_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(personB.avg_status_predictions.avg_pred_sAGR)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(this.round_scores(personB.avg_status_predictions.avg_pred_sAGR) - this.round_scores(val))}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'N_score') {
			    	scores.push(
			    				<TableRow>
				    				{neu_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(personB.avg_status_predictions.avg_pred_sNEU)}</TableRowColumn>
						    		<TableRowColumn style={row_style}>{this.round_scores(this.round_scores(personB.avg_status_predictions.avg_pred_sNEU) - this.round_scores(val))}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
		    }

		    var table_header = <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
					      <TableRow>
						    <TableHeaderColumn style={{fontSize: 17}}>Traits</TableHeaderColumn>
						    <TableHeaderColumn style={{fontSize: 17}}>Me</TableHeaderColumn>
					        <TableHeaderColumn style={{fontSize: 17}}>{personB.name}</TableHeaderColumn>
					        
					        <TableHeaderColumn style={{fontSize: 17}}>Difference</TableHeaderColumn>
					      </TableRow>
					    </TableHeader>

			var elements = <div style={items_style}>
					<div style={element_style}>
						<img style={plot_img_style} src={'/static/'+personB.compare_radar_plot_url}>
						</img>
						<h5>Me vs. {personB.name}</h5>
					</div>
					<div style={table_style}>
						<Tabs>
	    					<Tab label="Percentiles">
				            	<Table>
				            		{table_header}
									<TableBody displayRowCheckbox={false}>
							        	{percentiles}
							        </TableBody>
								</Table>
				            </Tab>
	    					<Tab label="Scores">
				            	<Table>
				            		{table_header}
									<TableBody displayRowCheckbox={false}>
							        	{scores}
							        </TableBody>
								</Table>
				            </Tab>
						</Tabs>
					</div>
				</div>
		}

		return (
			<div>
				<Paper zDepth={2}>
					{elements}
				</Paper>
			</div>
			)
	}
}