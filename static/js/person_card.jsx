import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';

export default class PersonCard extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    _.bindAll(this, ["round_probs", "round_scores", "round_percs"]);
	}

	round_probs(number) {
		return Math.round(number * 10000)/100
	}

	round_scores(number) {
		return Math.round(number * 100)/100
	}

	round_percs(number) {
		return Math.round(number)
	}

  	render() {
  		
	    const { person, my_personality } = this.props;

	    const row_style = {
	    	fontSize: 15,
	    }

	    const item_style = {
	    	paddingTop: 30,
	    }

	    const card_style = {
	    	// height: '50%',
	    	display: 'flex',
	    	justifyContent: 'space-around'
	    }

	    const preds_style = {
	    	width: '35%',
	    	position: 'relative',
	    	marginLeft: 'auto',
	    	// float: 'right',
	    }

	    const avatar_style = {
	    	margin: 20
	    }

	    const name_style = {
	    }

	    const profile_style = {
	    	margin: 'auto',
	    	display: 'inline-flex',
	    	flexDirection: 'column',
	    	alignItems: 'center',
	    }

	    const plot_style = {
	    	position: 'relative',
	    	margin: 'auto',
	    }

	    const plot_img_style = {
	    	position: 'relative',
	    	height: '35%',
	    }

	    const opn_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>O</span>) Openness</TableRowColumn>
	    const con_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>C</span>) Conscientiousness</TableRowColumn>
	    const ext_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>E</span>) Extraversion</TableRowColumn>
	    const agr_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>A</span>) Agreeableness</TableRowColumn>
	    const neu_row = <TableRowColumn style={row_style}>(<span style={{fontWeight: 'bold'}}>N</span>) Neuroticism</TableRowColumn>


	    if (my_personality) {

	    	var actual_percentiles = []
	    	var actual_scores = []
	    	for (var trait in person.actual_personality_scores['percentiles']) {
		    	var val = person.actual_personality_scores['percentiles'][trait]
		    	if (trait == 'O_perc') {
			    	actual_percentiles.push(
			    				<TableRow>
				    				{opn_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'C_perc') {
			    	actual_percentiles.push(
			    				<TableRow>
				    				{con_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'E_perc') {
			    	actual_percentiles.push(
			    				<TableRow>
				    				{ext_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'A_perc') {
			    	actual_percentiles.push(
			    				<TableRow>
				    				{agr_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'N_perc') {
			    	actual_percentiles.push(
			    				<TableRow>
				    				{neu_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
		    }

		    for (var trait in person.actual_personality_scores['scores']) {
		    	var val = person.actual_personality_scores['scores'][trait]
		    	if (trait == 'O_score') {
			    	actual_scores.push(
			    				<TableRow>
				    				{opn_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'C_score') {
			    	actual_scores.push(
			    				<TableRow>
				    				{con_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'E_score') {
			    	actual_scores.push(
			    				<TableRow>
				    				{ext_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'A_score') {
			    	actual_scores.push(
			    				<TableRow>
				    				{agr_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (trait == 'N_score') {
			    	actual_scores.push(
			    				<TableRow>
				    				{neu_row}
						    		<TableRowColumn style={row_style}>{this.round_scores(val)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
		    }

	    	var card_elements = <div style={card_style}>
					    	<div style={plot_style}>
				    			<img src={'/static/'+person.radar_plot_url} style={plot_img_style}>
				    			</img>
				    		</div>
			    			<div style={preds_style}>
			    				<Tabs>
			    					<Tab label="Percentiles">
						            	<Table>
											<TableBody displayRowCheckbox={false}>
									        	{actual_percentiles}
									        </TableBody>
										</Table>
						            </Tab>
			    					<Tab label="Scores">
						            	<Table>
											<TableBody displayRowCheckbox={false}>
									        	{actual_scores}
									        </TableBody>
										</Table>
						            </Tab>
								</Tabs>
			    			</div>
		    			</div>
	    }
	    else {
	    	var score_predictions = []
		    var prob_predictions = []
		    var percentile_predictions = []

		    for (var pred_type in person.pred_percentiles) {
		    	var pred = person.pred_percentiles[pred_type]
		    	if (pred_type == 'pred_perc_sOPN') {
			    	percentile_predictions.push(
			    				<TableRow>
				    				{opn_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(pred)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (pred_type == 'pred_perc_sCON') {
			    	percentile_predictions.push(
			    				<TableRow>
				    				{con_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(pred)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (pred_type == 'pred_perc_sEXT') {
			    	percentile_predictions.push(
			    				<TableRow>
				    				{ext_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(pred)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (pred_type == 'pred_perc_sAGR') {
			    	percentile_predictions.push(
			    				<TableRow>
				    				{agr_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(pred)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
			    if (pred_type == 'pred_perc_sNEU') {
			    	percentile_predictions.push(
			    				<TableRow>
				    				{neu_row}
						    		<TableRowColumn style={row_style}>{this.round_percs(pred)}</TableRowColumn>
						    	</TableRow>
				    		)
			    }
		    }

		    for (var pred_type in person.avg_status_predictions) {
		    	var pred = person.avg_status_predictions[pred_type]

		    	if (pred_type != 'DATE' && pred_type != 'NAME') {
		    		// Scores
		    		if (pred_type == 'avg_pred_sOPN') {
		    			score_predictions.push(
		    				<TableRow>
			    				{opn_row}
					    		<TableRowColumn style={row_style}>{this.round_scores(pred)}</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_sCON') {
		    			score_predictions.push(
		    				<TableRow>
			    				{con_row}
					    		<TableRowColumn style={row_style}>{this.round_scores(pred)}</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_sEXT') {
		    			score_predictions.push(
		    				<TableRow>
			    				{ext_row}
					    		<TableRowColumn style={row_style}>{this.round_scores(pred)}</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_sAGR') {
		    			score_predictions.push(
		    				<TableRow>
			    				{agr_row}
					    		<TableRowColumn style={row_style}>{this.round_scores(pred)}</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_sNEU') {
		    			score_predictions.push(
		    				<TableRow>
			    				{neu_row}
					    		<TableRowColumn style={row_style}>{this.round_scores(pred)}</TableRowColumn>
					    	</TableRow>
			    		)
		    		}

		    		// Probabilites
		    		if (pred_type == 'avg_pred_prob_cOPN') {
		    			prob_predictions.push(
		    				<TableRow>
			    				{opn_row}
					    		<TableRowColumn style={row_style}>{this.round_probs(pred)}%</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_prob_cCON') {
		    			prob_predictions.push(
		    				<TableRow>
			    				{con_row}
					    		<TableRowColumn style={row_style}>{this.round_probs(pred)}%</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_prob_cEXT') {
		    			prob_predictions.push(
		    				<TableRow>
			    				{ext_row}
					    		<TableRowColumn style={row_style}>{this.round_probs(pred)}%</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_prob_cAGR') {
		    			prob_predictions.push(
		    				<TableRow>
			    				{agr_row}
					    		<TableRowColumn style={row_style}>{this.round_probs(pred)}%</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    		if (pred_type == 'avg_pred_prob_cNEU') {
		    			prob_predictions.push(
		    				<TableRow>
			    				{neu_row}
					    		<TableRowColumn style={row_style}>{this.round_probs(pred)}%</TableRowColumn>
					    	</TableRow>
			    		)
		    		}
		    	}	    	
		    }

	    	var card_elements = <div style={card_style}>
					    	<div style={profile_style}>
				    			<a href={person.url} target="_blank">
				    				<Avatar style={avatar_style} size={150} src={person.profile_pic_url}/>
				    			</a>
				    			<a href={person.url} target="_blank">
				    				<span style={name_style}>{person.name}</span>
				    			</a>
				    		</div>
				    		<div style={plot_style}>
				    			<img src={'/static/'+person.radar_plot_url} style={plot_img_style}>
				    			</img>
				    		</div>
			    			<div style={preds_style}>
			    				<Tabs>
			    					<Tab label="Percentiles">
						            	<Table>
											<TableBody displayRowCheckbox={false}>
									        	{percentile_predictions}
									        </TableBody>
										</Table>
						            </Tab>
			    					<Tab label="Scores">
						            	<Table>
											<TableBody displayRowCheckbox={false}>
									        	{score_predictions}
									        </TableBody>
										</Table>
						            </Tab>
						            <Tab label="Probabilites">
					    				<Table>
											<TableBody displayRowCheckbox={false}>
									        	{prob_predictions}
									        </TableBody>
										</Table>
									</Tab>
								</Tabs>
			    			</div>
			    		</div>
	    }

	    return (
	    	<div style={item_style}>
	    		<Paper zDepth={2}>
	    			<div>
		    			{card_elements}
		    		</div>
	    		</Paper>
	    	</div>
	    	)
	}
}
