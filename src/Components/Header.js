import React, { Component } from 'react';
import SearchForm from './SearchForm';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            loggedIn: false, 
            // redirect: this.props.redirect,
        }
    }

    componentDidUpdate(oldProps){
        if (this.state.loggedIn === false && this.props.user !== null){
            this.setState({user: this.props.user,
                loggedIn: true  
            });
        }
    }

    render() {
        return (
        <header className="main-header">
        <div className="header-wrapper">
            <Link exact to='/'><img src={require("./critter-logo.png")} className="header-logo" /></Link>
                {
                    this.props.user
                    ? <button className="button header-button" onClick={this.props.logout}>Log Out</button> 
                    : <button className="button header-button" onClick={this.props.login}>Log In</button>
                }
                {
                    this.props.user && <Link className="link button header-button" to='/faves'>Faves</Link>
                }
            <label className="dropdown-button header-button button" htmlFor="dropdown"><i class="fas fa-search"></i></label>
            <input type="checkbox" id="dropdown"/>
            <SearchForm startLoader={this.props.startLoader} location={this.props.location} breeds={this.props.breeds} getPets={this.props.getPets}/>
        </div>
        </header>
        )
    }
}

export default Header;