import React from 'react';
import ReactDOM from 'react-dom';
import { ClassicSpinner } from "react-spinners-kit";
import 'bootstrap/dist/css/bootstrap.css';
import '../src/index.css';

class Country extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	      	like : false,
	      	editing : false
	    }
	}
	handleLike(countryName){
		this.setState({
	      	like : !this.state.like
	      });
	}

	showEditingView(){
		return (
			<div className="col-12 col-sm-6 col-md-4 col-lg-3">
				<div className="my-3 mx-1 p-1 bg-dark border border-dark rounded shadow text-lg text-white text-center border">
					<input type="text" ref="newCountryName"   
							className="form-control" placeholder={this.props.name}/>				
					<hr className="w-100 my-1 p-0 bg-success"/>
					<p className="m-0 mr-3 text-right">
						<span onClick={()=>this.save()}
							  className="glyphicon glyphicon-ok-circle blue my-2">
						</span>
						<span onClick={()=>this.cancel()}
							  className="ml-3 glyphicon glyphicon-remove-circle red my-2">
						</span>						
					</p>
				</div>				
			</div>
		)
	}

	showFinalView(){
		return (
			<div className="col-12 col-sm-6 col-md-4 col-lg-3">
				<div className="my-3 mx-1 p-1 bg-dark border border-dark rounded shadow text-lg text-white text-center border">
					<h1 className="p-3 red text-lg bg-light-blue-grey shadow"><b>{this.props.name}</b></h1>
					<p className="m-0 p-0 shadow text-white">
						<b>Posición: <i>{this.props.children}</i></b>
						<br/>
						<input type="checkbox" 
								onChange={() => this.handleLike()} 
								defaultChecked = {Boolean(this.state.like)}
							  	className="glyphicon glyphicon-heart glyphicon-heart-lg red"/>
						<br/>
						<span className="my-2">
							<b className="text-default">Like:  </b><em>{String(this.state.like)}</em>
						</span>
					</p>
					<hr className="w-100 my-2 p-0 bg-deep-orange"/>
					<p className="m-0 p-0 pr-3 text-right">
						<button type="button" onClick={()=>this.edit()}
							  className="btn btn-outline-secondary glyphicon glyphicon-pencil green my-2">
						</button>
						<span onClick={()=>this.remove()}
							  className="ml-3 glyphicon glyphicon-trash red my-2">
						</span>						
					</p>
				</div>
			</div>
		);		
	}

	edit(){
		this.setState({ editing : true });
	}

	cancel(){
		this.setState({ editing : false });
	}

	save(){
		this.props.onUpdate(this.refs.newCountryName.value, this.props.index)
		this.setState({ editing : false });
	}

	remove() {
		this.props.onRemove(this.props.index);
	}

	render() { 
		if (this.state.editing){
			return this.showEditingView();
		} else{
			return this.showFinalView()
		}
	}
};

// countries : [
// 	'Venezuela',
// 	'Colombia',
// 	'Argentína',
// 	'Bolívia',
// 	'Chile',
// 	'Perú',
// 	'Brazil'
// ]

class World extends React.Component {
	constructor(props) {
		super(props);		
		this.eachItem = this.eachItem.bind(this);
		this.state = {
	      	countries : [],
	      	loading : false	   
	    }
	}


	//before page load
	componentWillMount(){
		var country;
		var self = this;

		this.setState({
			loading : true
		});  

        fetch('https://restcountries.eu/rest/v1/all')
        .then(res => res.json())
        .then((data) => {
        	for (country in data){
        		self.add(data[country].name)
        	}  
			this.setState({
				loading : false
			});        		
        })
        .catch(console.log);
    }	
    //after page load
	componentDidMount() {	
	}	

	add(newCountry){
		
		if (typeof(newCountry) === 'undefined'){
			newCountry = this.refs.newCountryName.value;
		}

		if (!(newCountry==='') || (newCountry === 'undefined')){
			var currentCountries = this.state.countries;
			currentCountries.push(newCountry);
			this.setState({
					countries : currentCountries
				});
			this.refs.newCountryName.value = "";
		}
		else{
			//alert("New country name can't be empty");
		}
	}

	update(newCountryName, i){
		if (!(newCountryName==='') || (newCountryName === 'undefined')){
			var currentCountries = this.state.countries;
			currentCountries[i] = newCountryName;
			this.setState({
				countries : currentCountries
			});
		} else {
			//alert("Country name can't be empty");
		}
	}

	remove(i){
		var currentCountries = this.state.countries;
		currentCountries.splice(i,1);
		this.setState({
					countries : currentCountries
				});
	}

	handleKeyDown(e){
		if (e.charCode === 13){
			this.add();
		}
		if (e.keyCode === 13) {
			this.add();
		}		
	}

	eachItem(country, i) {		
		return (
			<Country key={i} 
					 index={i}
					 name={country}
					 onUpdate={(ncn)=> this.update(ncn, i)}
					 onRemove={()=> this.remove(i)}>
				{i+1}
			</Country>
		);
	}

	render() { 
		const { loading } = Boolean(this.state.loading);
		return (
			<div className="m-0 p-0 text-white">
				<header className="m-0 p-3 bg-deep-orange border-0 border-bottom-2 border-white shadow rounded-0 text text-lg text-center">
					<h1><b>World's Countries</b></h1>
					<br/>
					<i className="mt-3"><b>Total : </b>{this.state.countries.length}</i>
				</header>
				<div className="input-group m-0 mt-3 p-3">
					<input type="text" ref="newCountryName" 
							onKeyPress={(e)=> this.handleKeyDown(e)}  
							className="form-control" 
							placeholder="Write a name for the new country"/>
					<span className="input-group-btn mr-3">
						<div className="btn btn-default btn-success"
							 onClick={() => this.add()} >
							 +
						</div>
					</span>
				</div>				
				<div className="row">
					{
						this.state.countries.map(this.eachItem)
					}
				</div>
				<div className="loader-item">				
					<ClassicSpinner  size={40} color="#212121" loading={Boolean(this.state.loading)} />
				</div>
			</div>
		)
	}
}


ReactDOM.render(<World />, document.getElementById("container"));