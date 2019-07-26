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
				<div className="my-3 mx-1 p-1 bg-fondo border border-dark rounded shadow text-lg text-white text-center border">
					<h1 className="p-3 red text-lg bg-deep-green text-white shadow"><b>{this.props.name}</b></h1>
					<div className="m-0 p-0 bg-light-lime text-dark">
						<input type="text" ref="newCountryName"   
								className="form-control text-lg my-3" placeholder={this.props.name}/>				
					</div>
					<hr className="w-100 m-0 p-0 my-2 bg-white"/>
					<div className="m-0 p-0 text-right">
						<div className="btn-group m-0 mb-1 py-1 px-2">	
							<button type="button" onClick={()=>this.save()}
								  className="btn btn-sm btn-success border border-dark shadow text-white glyphicon glyphicon-ok-circle">
							</button>
							<button type="button" onClick={()=>this.cancel()}
								  className="btn btn-sm btn-success border border-dark shadow text-white glyphicon glyphicon-remove-circle">
							</button>							
						</div>
					</div>
				</div>				
			</div>
		)
	}

	showFinalView(){
		return (
			<div className="col-12 col-sm-6 col-md-4 col-lg-3">
				<div className="my-3 mx-1 p-1 bg-fondo border border-dark rounded shadow text-lg text-white text-center border">
					<h1 className="p-3 red text-lg bg-deep-green text-white shadow"><b>{this.props.name}</b></h1>
					<div className="m-0 p-0 bg-light-lime text-dark">
						<strong>Posición: <i>{this.props.children}</i></strong>
						<br/>
						<input type="checkbox" 
								onChange={() => this.handleLike()} 
								defaultChecked = {Boolean(this.state.like)}
							  	className="glyphicon glyphicon-heart glyphicon-heart-lg red"/>
						<br/>
						<span className="my-2">
							<b className="text-default">Like:  </b><em>{String(this.state.like)}</em>
						</span>
					</div>
					<hr className="w-100 m-0 p-0 my-2 bg-white"/>
					<div className="m-0 p-0 text-right">
						<div className="btn-group m-0 mb-1 py-1 px-2">
							<button type="button" onClick={()=>this.edit()}
								  className="btn btn-sm btn-success border border-dark shadow text-white glyphicon glyphicon-pencil">
							</button>
							<button type="button" onClick={()=>this.remove()}
								  className="btn btn-sm btn-success border border-dark shadow text-white glyphicon glyphicon-trash">
							</button>		
						</div>			
					</div>
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

        	console.log(data);

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
				<header className="m-0 p-3 bg-deep-green border-0 border-bottom-2 border-white shadow rounded-0 text text-lg text-center">
					<h1><b>World's Countries</b></h1>
					<br/>
					<i className="mt-3"><b>Total : </b>{this.state.countries.length}</i>
				</header>
				<div className="input-group input-group-lg m-0 mt-3 p-3">
					<input type="text" ref="newCountryName" 
							onKeyPress={(e)=> this.handleKeyDown(e)}  
							className="form-control" 
							placeholder="To add a new country just write a name"/>
					<div className="input-group-prepend mr-3">
						<button type="button" className="btn btn-default btn-lg btn-success"
							 onClick={() => this.add()} >
							 <b>+</b>
						</button>
					</div>
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