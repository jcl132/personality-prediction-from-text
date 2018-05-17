import React, { PropTypes } from 'react'
import Question from './question'
import RaisedButton from 'material-ui/RaisedButton';

export default class PersonalityTest extends React.Component {
	constructor(props, context) {
		super(props, context);
		_.bindAll(this, ["handleSubmit", "handleAnswer"]);

		var questions = {
			'I am the life of the party.': 3,				
			'I feel little concern for others.': 3,				
			'I am always prepared.': 3,			
			'I get stressed out easily.': 3,					
			'I have a rich vocabulary.': 3,					
			"I don't talk a lot.": 3,				
			'I am interested in people.': 3,			
			'I leave my belongings around.': 3,			
			'I am relaxed most of the time.': 3,				
			'I have difficulty understanding abstract ideas.': 3,					
			'I feel comfortable around people.': 3,				
			'I insult people.': 3,			
			'I pay attention to details.': 3,					
			'I worry about things.': 3,				
			'I have a vivid imagination.': 3,				
			'I keep in the background.': 3,				
			"I sympathize with others' feelings.": 3,				
			'I make a mess of things.': 3,			
			'I seldom feel blue.': 3,				
			'I am not interested in abstract ideas.': 3,			
			'I start conversations.': 3,		
			"I am not interested in other people's problems.": 3,				
			'I get chores done right away.': 3,				
			'I am easily disturbed.': 3,			
			'I have excellent ideas.': 3,					
			'I have little to say.': 3,				
			'I have a soft heart.': 3,				
			'I often forget to put things back in their proper place.': 3,					
			'I get upset easily.': 3,					
			'I do not have a good imagination.': 3,					
			'I talk to a lot of different people at parties.': 3,					
			'I am not really interested in others.': 3,					
			'I like order.': 3,					
			'I change my mood a lot.': 3,					
			'I am quick to understand things.': 3,					
			"I don't like to draw attention to myself.": 3,					
			'I take time out for others.': 3,					
			'I shirk my duties.': 3,					
			'I have frequent mood swings.': 3,					
			'I use difficult words.': 3,					
			"I don't mind being the center of attention.": 3,					
			"I feel others' emotions.": 3,					
			'I follow a schedule.': 3,					
			'I get irritated easily.': 3,					
			'I spend time reflecting on things.': 3,					
			'I am quiet around strangers.': 3,					
			'I make people feel at ease.': 3,					
			'I am exacting in my work.': 3,					
			'I often feel blue.': 3,				
			'I am full of ideas.': 3,
	 	}

		this.state = {
			questions: questions
		}
	}

	handleSubmit() {
		fetch("/submit_personality_test", {
	      method: "POST",
	      headers: {
	        'Content-Type': 'application/json',
	        'Accept': 'application/json',
	        'Cache-Control': 'no-store, no-cache, must-revalidate'
	      },
	      body: JSON.stringify(this.state.questions),
	    }).then(response =>
	        response.json().then(data => ({
	            data: data,
	            status: response.status
	        })
	    ).then(res => {
	    	this.props.updatePersonality(res.data)
	    }))
	}

	handleAnswer(question, answer) {
		this.state.questions[question] = answer
	}

	render() {
		// const questions = [
		// 	'I am the life of the party.',				
		// 	'I feel little concern for others.',				
		// 	'I am always prepared.',			
		// 	'I get stressed out easily.',					
		// 	'I have a rich vocabulary.',					
		// 	"I don't talk a lot.",				
		// 	'I am interested in people.',			
		// 	'I leave my belongings around.',			
		// 	'I am relaxed most of the time.',				
		// 	'I have difficulty understanding abstract ideas.',					
		// 	'I feel comfortable around people.',				
		// 	'I insult people.',			
		// 	'I pay attention to details.',					
		// 	'I worry about things.',				
		// 	'I have a vivid imagination.',				
		// 	'I keep in the background.',				
		// 	"I sympathize with others' feelings.",				
		// 	'I make a mess of things.',			
		// 	'I seldom feel blue.',				
		// 	'I am not interested in abstract ideas.',			
		// 	'I start conversations.',		
		// 	"I am not interested in other people's problems.",				
		// 	'I get chores done right away.',				
		// 	'I am easily disturbed.',			
		// 	'I have excellent ideas.',					
		// 	'I have little to say.',				
		// 	'I have a soft heart.',					
		// 	'I often forget to put things back in their proper place.',					
		// 	'I get upset easily.',					
		// 	'I do not have a good imagination.',					
		// 	'I talk to a lot of different people at parties.',					
		// 	'I am not really interested in others.',					
		// 	'I like order.',					
		// 	'I change my mood a lot.',					
		// 	'I am quick to understand things.',					
		// 	"I don't like to draw attention to myself.",					
		// 	'I take time out for others.',					
		// 	'I shirk my duties.',					
		// 	'I have frequent mood swings.',					
		// 	'I use difficult words.',					
		// 	"I don't mind being the center of attention.",					
		// 	"I feel others' emotions.",					
		// 	'I follow a schedule.',					
		// 	'I get irritated easily.',					
		// 	'I spend time reflecting on things.',					
		// 	'I am quiet around strangers.',					
		// 	'I make people feel at ease.',					
		// 	'I am exacting in my work.',					
		// 	'I often feel blue.',				
		// 	'I am full of ideas.',
	 // 	]

	 	const question_elements = []

	 	for (var i in Object.keys(this.state.questions)) {
	 		question_elements.push(
	 			<Question 
	 				question={Object.keys(this.state.questions)[i]} 
	 				question_number={String(parseInt(i) + 1)}
	 				handleAnswer={this.handleAnswer}/>
	 			)
	 	}

		return(
			<div style={{marginTop: 20}}>
				<h2>
					Personality Test
				</h2>
				<p style={{marginTop: 10, width: '50%'}}>
					This test consists of fifty items that you must rate on how true 
					they are about you on a five point scale where: <br/>
					1 = Strongly Disagree, 2 = Disagree, 3 = Neutral 4 = Agree, and 5 = Strongly Agree. 
				</p>
				{question_elements}
				<RaisedButton label="Submit" primary={true} style={{marginTop: 20}} onClick={this.handleSubmit}/>
			</div>
			)
	}
}