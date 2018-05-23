import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";

import RaisedButton from 'material-ui/RaisedButton';

import PersonalityTest from './personality_test'
import PersonCard from './person_card'


export default class MyPersonality extends React.Component {
	constructor(props, context) {
		super(props, context);
		_.bindAll(this, ['updatePersonalityFromTest', 'takeTest']);

		this.state = {
			take_test: false
		}
	}

	// loadMyPersonality() {
	// 	this.props.loadMyPersonality()
	// }

	componentDidMount() {
	    // this.loadMyPersonality()
	}

	updatePersonalityFromTest(data) {
		// this.setState({
		// 	my_personality: data,
		// 	take_test: false
		// })
	}

	takeTest() {
		this.setState({take_test: true})
	}

	render() {

		const { my_personality_data } = this.props;
		
		if (my_personality_data == null) {
			var my_personality_card = null
		}
		else {
			var my_personality_card = <PersonCard person={my_personality_data} my_personality={true}/>
		}

		if(this.state.take_test) {
			var test = <PersonalityTest updatePersonality={this.updatePersonalityFromTest}/>
		} 
		else {
			var test = <RaisedButton primary={true} style={{marginTop: 30}} onClick={this.takeTest} label="Take Personality Test" />
		}

		return (
			<div style={{marginLeft: 30, marginRight: 30}}>
				<h2 style={{marginTop: 10}}> My Personality </h2>
				{my_personality_card}
				{test}
			</div>
			)
	}
}
