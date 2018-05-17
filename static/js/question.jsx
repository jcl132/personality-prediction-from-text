import React, { PropTypes } from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';

export default class Question extends React.Component {
	constructor(props, context) {
		super(props, context);
		_.bindAll(this, ["handleSlider"]);

		this.state = {
			answer: 3,
			
		}
	}

	handleSlider(e, value) {

		// inverse scores for opposite questions
		if (this.props.question in [
			"I don't talk a lot.",
			'I keep in the background.',
			'I have little to say.',
			"I don't like to draw attention to myself.",
			'I am quiet around strangers.',
			'I am relaxed most of the time.',
			'I seldom feel blue.',
			'I feel little concern for others.',
			'I insult people.',
			"I am not interested in other people's problems.",
			'I am not really interested in others.',
			'I leave my belongings around.',
			'I make a mess of things.',
			'I often forget to put things back in their proper place.',
			'I shirk my duties.',
			'I am exacting in my work.',
			'I have difficulty understanding abstract ideas.',
			'I am not interested in abstract ideas.',
			'I do not have a good imagination.',
	 	]) {
	 		value = 6 - value
	 	}

		this.setState({
			answer: value
		})
		this.props.handleAnswer(this.props.question, value)
	}

	render() {

		const { question, question_number, handleAnswer } = this.props;

		const container_style = {
	    	marginTop: 20,
	    	width: '30%'
		}

		const item_style = {
	    	display: 'flex',
	    	flexDirection: 'column',
	    	justifyContent: 'space-evenly',
	    	padding: 20
	    }

	    const question_style = {
	   //  	marginLeft: 'auto',
	 		// marginRight: 'auto',
	    }

		const slider_style = {
	 		height: '7%'
	 	}

	 	const answer_style = {
	 		marginLeft: 'auto',
	 		marginRight: 'auto'
	 		// position: 'center',
	 		// float: 'center'
	 	}


		const text_answers = [
			"Strongly Disagree",
			"Disagree",
			"Neutral",
			"Agree",
			"Strongly Agree"
		]

		return(
			<div style={container_style}>
				<Paper zDepth={2}>
					<div style={item_style}>
						<p style={question_style}>
							{question_number}. &nbsp; {question}
						</p>
						<p style={answer_style}>
							{text_answers[this.state.answer-1]}
						</p>
						<p style={answer_style}>
							{this.state.answer}
						</p>
						<Slider 
							value={this.state.answer} 
							style={slider_style}
							min={1} 
							max={5} 
							step={1}
							onChange={this.handleSlider} />	
					</div>
				</Paper>
			</div>
			)
	}
}