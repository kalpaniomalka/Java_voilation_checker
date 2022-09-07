import React, {Component} from 'react';
import {Row,Form,Button, Col,Card,Table, Overlay,Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../App/App.css';
import TextareaAutosize from 'react-textarea-autosize';
import axios from "axios";
import Loader from 'react-loader-spinner'

class BmiForm extends Component{
    constructor(){
        super();
        this.state={
            sourceCode: null,
			result: null,
			godClass: null, //1
			dataClass: null, //2
			longMethod: null, //3
			featureEnvy: null, //4
			shotgunsurgery: null, //5
			classMemberPrivate: null, //6
			classMemberByScope: null,  //7
			emptyCatchBlock: [],  //8
			redundentIntialization: null, //9
			forLoops: null, //10
			ruleCount: 0,
			rule1Msg: "",
			rule2Msg: "",
			rule3Msg: "",
			rule4Msg: "",
			rule5Msg: "",
			rule6Msg: "",
			rule7Msg: "",
			rule8Msg: "",
			rule9Msg: "",
			rule10Msg: "",
			percentage: 0,
			rule1:false,
			rule2:false,
			rule6:false,
			rule7:false,
			rule8:false,
			rule9:false,
			rule10:false
		};

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange = (event) => {
		console.log(event.target.value)
		this.setState({sourceCode:event.target.value})
		console.log(this.state.sourceCode)
	} 

	validateRule1(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/godClass', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({dataClass:response.data})
				currentComponent.setState({ruleCount:1})
				if(response.data == '1'){
					currentComponent.setState({rule1Msg:"The uploaded source code is a god class."})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule1:true})
					currentComponent.validateRule2()
				}
				else{
					currentComponent.setState({rule1Msg:"The uploaded source code is not a god class"})
					currentComponent.validateRule2()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule2(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/dataClass', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({dataClass:response.data})
				currentComponent.setState({ruleCount:2})
				if(response.data == '0'){
					currentComponent.setState({rule2Msg:"The uploaded source code is a data class."})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule2:true})
					currentComponent.validateRule6()
				}
				else{
					currentComponent.setState({rule2Msg:"The uploaded source code is not a data class"})
					currentComponent.validateRule6()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule6(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/privateClassMembers', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({classMemberPrivate:response.data})
				currentComponent.setState({ruleCount:6})
				if(response.data != '0'){
					currentComponent.setState({rule6Msg:"The uploaded source code include public class members on the following lines: "+response.data})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule6:true})
					currentComponent.validateRule7()
				}
				else{
					currentComponent.setState({rule6Msg:"The uploaded source code is not included public class members."})
					currentComponent.validateRule7()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule7(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/orderClassMembers', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({classMemberByScope:response.data})
				currentComponent.setState({ruleCount:7})
				if(response.data == 'ns'){
					currentComponent.setState({rule7Msg:"The class members are not ordered by scopes."})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule7:true})
					currentComponent.validateRule8()
				}
				else if(response.data == '0'){
					currentComponent.setState({rule7Msg:"The source code doesn't include class members"})
					currentComponent.validateRule8()
				}
				else{
					currentComponent.setState({rule7Msg:"The class members are ordered by scopes"})
					currentComponent.validateRule8()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule8(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/emptyCatch', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({emptyCatchBlock:response.data})
				currentComponent.setState({ruleCount:8})
				if(response.data != '0'){
					currentComponent.setState({rule8Msg:"The uploaded source code include empty catch blocks on the following lines: "+response.data})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule8:true})
					currentComponent.validateRule9()
				}
				else{
					currentComponent.setState({rule8Msg:"The uploaded source code is not included empty catch blocks"})
					currentComponent.validateRule9()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule9(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/redundentIntialization', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({redundentIntialization:response.data})
				currentComponent.setState({ruleCount:9})
				if(response.data != '0'){
					currentComponent.setState({rule9Msg:"The uploaded source code include redundent initialization on the following lines: "+response.data})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule9:true})
					currentComponent.validateRule10()
				}
				else{
					currentComponent.setState({rule9Msg:"The uploaded source code is not included redundent initialization."})
					currentComponent.validateRule10()
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	validateRule10(){
		let currentComponent = this;   

		axios.get('http://127.0.0.1:5000/api/forLoop', {
		}).then(function(response){
				console.log(response.data);
				currentComponent.setState({forLoops:response.data})
				currentComponent.setState({ruleCount:10})
				if(response.data != '0'){
					currentComponent.setState({rule10Msg:"The uploaded source code include for loops with indexes on the following lines: "+response.data})
					currentComponent.setState({percentage:currentComponent.state.percentage+1})
					currentComponent.setState({rule10:true})
				}
				else{
					currentComponent.setState({rule10Msg:"The uploaded source code is not included for loops with indexes."})
				}

		}).catch(function(error){
			console.log(error);
		});
	}

	handleSubmit(){
		var myData = [this.state.sourceCode]

		let currentComponent = this;   
		
		if(this.state.sourceCode.length>50){
            axios.get('http://127.0.0.1:5000/api/insertCode', {
                params: {
                    code: myData[0]
                }
            }).then(function(response){
                    console.log(response.data);
                    currentComponent.setState({result:response.data})

					if(response.data == "JAVA"){
						window.alert("It is a JAVA Code. We will give you the complete result in a few seconds.");
						currentComponent.setState({ruleCount:0})
						currentComponent.setState({percentage:0})
						currentComponent.setState({rule1:false})
						currentComponent.setState({rule2:false})
						currentComponent.setState({rule6:false})
						currentComponent.setState({rule7:false})
						currentComponent.setState({rule8:false})
						currentComponent.setState({rule9:false})
						currentComponent.setState({rule10:false})
						currentComponent.validateRule1()
					}
					else{
						window.alert("Not a JAVA Code. Please try to verify using other procedures of the system.");
					}

            }).catch(function(error){
                console.log(error);
            });
		}else{
			window.alert("Invalid input")
		}
	}

	render (){
		return (
		<>
			<div className="row">
				<div>
					<label htmlFor="weight"><h6>Source Code</h6></label>
					<TextareaAutosize 
					 placeholder="Enter Your Source code Here.."
					 onChange={this.handleChange}
					 className="code"
					 />
				</div>
			</div>
			<div className="center">
				<button
					id="validate-btn"
					className="calculate-btn"
					type="button"
					disabled={!this.state.sourceCode}
					onClick={this.handleSubmit}
				>
					Validate
				</button>
			</div>

			{
            this.state.result == "JAVA" && this.state.ruleCount!=10?
			<div  style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}}>
				<Loader
					type="Circles"
					color="#00BFFF"
					height={100}
					width={100}
				   // timeout={3000} //3 secs
				/>
			</div>
            :null
            }

			{
            this.state.result == "JAVA" && this.state.ruleCount==10?
			<Table className="tableData">
  				<tbody>
    				<tr>
					{
            		this.state.rule1?
      					<td class="violate"><strong>God Class</strong></td>
					:null
            		}
					{
            		this.state.rule1 ==false?
      					<td>God Class</td>
					:null
            		}
      					<td>{this.state.rule1Msg}</td>
    				</tr>
    				<tr>
					{
            		this.state.rule2?
      					<td class="violate"><strong>Data Class</strong></td>
					:null
            		}
					{
            		this.state.rule2 == false?
      					<td>Data Class</td>
					:null
            		}
      					<td>{this.state.rule2Msg}</td>
    				</tr>
					<tr>
					{
            		this.state.rule6?
      					<td class="violate"><strong>Class Member should be Private</strong></td>
					:null
            		}
					{
            		this.state.rule6 == false?
      					<td>Class Member should be Private</td>
					:null
            		}
      					<td colSpan="2">{this.state.rule6Msg}</td>
    				</tr>
					<tr>
					{
            		this.state.rule7?
      					<td class="violate"><strong>Class Member order by Scope</strong></td>
					:null
            		}
					{
            		this.state.rule7 == false?
      					<td>Class Member order by Scope</td>
					:null
            		}
      					<td colSpan="2">{this.state.rule7Msg}</td>
    				</tr>
					<tr>
					{
            		this.state.rule8?
      					<td class="violate"><strong>Empty Catch Blocks</strong></td>
					:null
            		}
					{
            		this.state.rule8 == false?
      					<td>Empty Catch Blocks</td>
					:null
            		}
      					<td colSpan="2">{this.state.rule8Msg}</td>
    				</tr>
					<tr>
					{
            		this.state.rule9?
      					<td class="violate"><strong>Redundent Initilization</strong></td>
					:null
            		}
					{
            		this.state.rule9 == false?
      					<td>Redundent Initilization</td>
					:null
            		}
      					<td colSpan="2">{this.state.rule9Msg}</td>
    				</tr>
					<tr>
					{
            		this.state.rule10?
      					<td class="violate"><strong>Foor Loops with indexes</strong></td>
					:null
            		}
					{
            		this.state.rule10 == false?
      					<td>Foor Loops with indexes</td>
					:null
            		}
      					<td colSpan="2">{this.state.rule10Msg}</td>
    				</tr>
  				</tbody>
			</Table>
			 :null
            }
			<br/>
			{
            this.state.result == "JAVA" && this.state.ruleCount==10?
			<div className="percentage">
				<h5>Number of Violated Rules: {this.state.percentage}</h5>
				<h5>Percentage of total violation: {(this.state.percentage*14.28571428).toFixed(2)}%</h5>
			</div>
			:null
		}
		</>
		);
    }
}

export default BmiForm;