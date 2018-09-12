import React, { Component } from 'react';
import Header from './Header';
import firebase from 'firebase';
import PetCard from './PetCard';
import { Link } from 'react-router-dom';

const auth = firebase.auth();

class FavePets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // userID: this.props.user.uid,
            favePets: [],
            userName: '',
        }
    }
    componentDidMount = () => {
        auth.onAuthStateChanged((user) => {
            console.log(user);
            let faveRef = firebase.database().ref(`${user.uid}/faves`); 
            faveRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    let favePets = Object.entries(snapshot.val()).map((pet) => {
                        return ({
                            name: pet[1].name,
                            breed: pet[1].breed,
                            photo: pet[1].photo,
                            sex: pet[1].sex,
                            id: pet[1].id,
                            key: pet[0]
                        })
                    });
                    this.setState({
                        favePets: favePets,
                        userName: user.displayName
                    });
                } else {
                    this.setState({
                        favePets: [],
                        userName: ''
                    })
                }
            })
                
        })
    }

    render() {

        
        return (
            <div>
                <Header user={this.props.user} login={this.props.login} logout={this.props.logout} location={this.props.location} breeds={this.props.breeds} getPets={this.props.getPets} />
                <div className="fave-pets-body">
                {
                    this.state.userName
                    ? <h2 className="fave-pets-heading">{this.state.userName}'s fave critters</h2>
                    : <h2 className="fave-pets-heading">your fave critters</h2>
                }
                    <div className="fave-pets clearfix">
                        {
                            this.state.favePets.length === 0 &&
                            <h3>You have no fave critters. Add some!</h3>
                        }
                        
                        {
                            this.state.favePets.map((pet) => {
                            return (
                            <div className="saved-pet">        
                                <PetCard pet={pet} key={pet.key} />
                                <button className="button delete-button" id={pet.key} 
                                onClick={() => this.props.deleteFromFaves(pet.key)}>DELETE FROM FAVES</button>
                            </div>    
                                )
                            })
                        }
                        <Link className="link button fave-pets-link" to='/results'>Back to results</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default FavePets;