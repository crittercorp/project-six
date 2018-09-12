import React, { Component } from 'react';
import SearchForm from './SearchForm';
import { Link } from 'react-router-dom';

class Landing extends Component {
    render() {
        return (
            <div className="landing-page">
                <header className="landing-header">
                {
                    this.props.user
                    ? <button className="button" onClick={this.props.logout}>Log Out</button> 
                    : <button className="button" onClick={this.props.login}>Log In</button>
                } 
                  {
                    this.props.user && <Link className="link button header-button" to='/faves'>Faves</Link>
                }  
                </header>

        <div className="wrapper-landing"> 
                <div className="landing-title">
                    <img src={require("./critter-logo.png")} className="landing-logo" />
                    <img src={require("./glitter-background.gif")} className="glitter" />

                    {/* <h2 className="landing-tagline">Alternative Pets for Alternative People</h2> */}
                </div>

            <div className="welcome-container clearfix">  
                <div className="welcome box">
                    <h3>welcome<i class="fas fa-times"></i></h3>
                    <p>Critter is an App to connect alternative pets to alternative people; You're a unqiue individual and deserve a pet to compliment that. Narrow down your search with Critter and find the perfect adoptable pet in your area!</p>
                </div>
                <div className="instruction box">
                    <h3>how it works<i class="fas fa-times"></i></h3>
                    <ul>
                        <li>Step One: Browse freely or log in with Google to save pets to your Faves section and view them all together!</li>
                        <li>Step Two: Search for pets in your area by entering your city and province/state in the search bar!</li>
                        <li>Step three: Click "Read More" on your Faves section for further info about each animal, email them to a friend, or tweet about your new potential pet!</li>
                    </ul>
                </div>  
            </div>

                <div className="landing-search-form box clearfix">
                    <h3>search critters<i class="fas fa-times"></i></h3>
                    <SearchForm location={this.props.location} breeds={this.props.breeds} getPets={this.props.getPets}/>
                </div>
            </div>
            <footer>
                <p>powered by PetFinder API</p>
                <p>© 2018 Kandace O'Brien, Scott Girouard, and Susie Kim</p>
            </footer>
        </div>       
        )
    }
}

export default Landing;