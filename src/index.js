import React from 'react';
import ReactDOM from 'react-dom';
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
					<h1 className="p-3 bg-white red text-sm rounded shadow"><b>{this.props.name}</b></h1>
					<p className="p-2 bg-success text text-lg text-white rounded">
						<b>Posición: <i>{this.props.children}</i></b>
					</p>
					<p className="m-0 p-0 bg-dark">
						<input type="checkbox" 
								onChange={() => this.handleLike()} 
								defaultChecked = {Boolean(this.state.like)}
							  	className="glyphicon glyphicon-heart glyphicon-heart-lg red"/>
						<br/>
						<span className="my-2">
							<b className="text-default">Like:  </b><em>{String(this.state.like)}</em>
						</span>
					</p>
					<hr className="w-100 my-2 p-0 bg-success"/>
					<p className="m-0 mr-3 text-right">
						<span onClick={()=>this.edit()}
							  className="glyphicon glyphicon-pencil blue my-2">
						</span>
						<span onClick={()=>this.remove()}
							  className="ml-3 glyphicon glyphicon-trash green my-2">
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
	      	spinnerOn : "glyphicon glyphicon-refresh",      	
	      	spinnerOff : "glyphicon glyphicon-refresh glyphicon-refresh-animate"
	    }
	}


	//before page load
	componentWillMount(){
		var country;
		var self = this;

        fetch('https://restcountries.eu/rest/v1/all')
        .then(res => res.json())
        .then((data) => {
        	for (country in data){
        		self.add(data[country].name)
        	}
         	document.getElementById("spi").classList.add('glyphicon-refresh-animate');
        })
        .catch(console.log)
    }	
    //after page load
	componentDidMount() {		
		document.getElementById("spi").classList.remove('glyphicon-refresh-animate');
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
		return (
			<div className="container container-fluid">
				<header className="my-5 mx-0 bg-warning border border-dark shadow rounded text text-lg text-center">
					<h1>World's Countries</h1>
					<i className="mt-3"><b>Total : </b>{this.state.countries.length}</i>
					<br/>
					<span className="mt-5 text text-xl" ref="spinner" id="spi"
						className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
				</header>
				<div className="input-group">
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
			</div>
		)
	}
}


ReactDOM.render(<World />, document.getElementById("container"));