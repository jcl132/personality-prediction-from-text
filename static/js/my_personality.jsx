import React, { PropTypes } from 'react'
import ReactDOM from "react-dom";

import RaisedButton from 'material-ui/RaisedButton';

import PersonalityTest from './personality_test'
import PersonCard from './person_card'


export default class MyPersonality extends React.Component {
	constructor(props, context) {
		super(props, context);
		_.bindAll(this, ["load_my_personality", 'updatePersonalityFromTest', 'takeTest']);

		this.state = {
			my_personality: null,
			take_test: false
		}
	}

	load_my_personality() {
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
		    my_personality: res.data,
		  });
		}))
		
	}

	componentDidMount() {
	    this.load_my_personality()
	}

	updatePersonalityFromTest(data) {
		this.setState({
			my_personality: data,
			take_test: false
		})
	}

	takeTest() {
		this.setState({take_test: true})
	}

	render() {
		
		if (this.state.my_personality == null) {
			var my_personality_card = null
		}
		else {
			var my_personality_card = <PersonCard person={this.state.my_personality} my_personality={true}/>
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
