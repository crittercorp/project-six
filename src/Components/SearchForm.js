import React, { Component } from 'react';
import { Redirect } from 'react-router'
import swal from 'sweetalert2';

class SearchForm extends Component {
    constructor() {
        super();
        this.state = {
            location: '',
            type: '',
            age: '',
            sex: '',
            breed: '',
            redirect: false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        console.log('submitted');
        e.preventDefault();
        if ( document.getElementById('type').value) {
            let location = this.state.location;
            if (this.props.location) {
                location = this.props.location;
            } 
            let type = this.state.type;
            let age = this.state.age;
            let sex = this.state.sex;
            let breed = this.state.breed;
    
            this.props.getPets(location, type, age, sex, breed);
            this.setState({ redirect: true })
        } else {
            swal({
                title: 'Please choose a type',
                type: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    render() {
        return (
            <form className="search-form" action="" onSubmit={this.handleSubmit}>
                <input type="text" id="location" value={this.props.location} placeholder="City, Province/State" onChange={this.handleChange}/>
                <select name="types" id="type" onChange={this.handleChange}>
                    <option value="" selected disabled hidden>Choose type</option>
                    <option value="reptile">Reptile</option>
                    <option value="smallfurry">Small and Furry</option>
                    <option value="bird">Flying Friends</option>
                </select>
                <select name="" id="breed" onChange={this.handleChange}>
                    <option value=" ">Any breed</option>
                    {
                        this.state.type === "reptile" && this.props.breeds.reptile.map((breed) => {
                            return <option value={breed}>{breed}</option>
                        })
                    }
                    {
                        this.state.type === "smallfurry" && this.props.breeds.smallfurry.map((breed) => {
                            return <option value={breed}>{breed}</option>
                        })
                    }
                    {
                        this.state.type === "bird" && this.props.breeds.bird.map((breed) => {
                            return <option value={breed}>{breed}</option>
                        })
                    }
                </select>
                <select name="" id="age" onChange={this.handleChange}>
                    <option value=" ">Any Age</option>
                    <option value="Baby">Lil Bebes</option>
                    <option value="Young">Youngins</option>
                    <option value="Adult">Grown ups</option>
                    <option value="Senior">Wrinkly boys</option>
                </select>
                <select name="" id="sex" onChange={this.handleChange}>
                    <option value=" ">Any Sex</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
                <input className="search-form-submit button" type="submit" value="FIND CRITTER"/>
                {
                    this.state.redirect && <Redirect to='/results'/>
                }
            </form>
        )
    }
}

export default SearchForm;