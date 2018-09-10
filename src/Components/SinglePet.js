import React, { Component } from 'react';
import Header from './Header';
import axios from 'axios';
import Qs from 'qs';
import {Link} from 'react-router-dom';
import firebase from 'firebase';


class singlePets extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            loggedIn: this.props.loggedIn, 
            animal: {
                name: '',
                breed: '',
                sex: '',
                photo: '',
                description: '',
                id: '',
            }
        }
    }
    componentDidMount(){
            axios({
                url: 'https://proxy.hackeryou.com',
                method: 'GET',
                dataResponse: 'json',
                paramsSerializer: function (params) {
                    return Qs.stringify(params, {
                    arrayFormat: 'brackets'
                    })
                },
                params: {
                    reqUrl: 'https://api.petfinder.com/pet.get',
                    params: {
                        key: '729776b0ff12f97426ef03d015026841',
                        format: 'json',
                        output: 'full',
                        id: this.props.match.params.pet_id,
                    },
                    xmlToJSON: false
                }
            }).then(res => {
                let petInfo = res.data.petfinder.pet
                this.setState({
                    animal: {
                        name: petInfo.name.$t,
                        breed: petInfo.breeds.breed.$t,
                        sex: petInfo.sex.$t,
                        photo: petInfo.media.photos.photo[2].$t,
                        description: petInfo.description.$t,
                        id: this.props.match.params.pet_id,
                    }
                })
            })    
    }
    componentDidUpdate(oldProps){
        if (this.state.loggedIn === false && this.props.user != null){
            this.setState({user: this.props.user,
                loggedIn: true    
            });
        }
    }

    getKey = (petID) => {
        const favesList = Object.entries(this.props.faves);
        console.log(favesList);
        for (let i = 0; i < favesList.length; i++) {
            if (favesList[i][1].id === petID) {
                const petKey = favesList[i][0];
                this.deleteFromFaves(petKey);
            }
        }
    }

    deleteFromFaves = (petKey) => {
        const confirmDelete = window.confirm('are you sure you want to remove this pet from your faves?');
        if (confirmDelete) {
            firebase.database().ref(`${this.state.user.uid}/faves/${petKey}`).remove();
            alert('removed from faves!');
        }
    }

    render() {
        return (
            <div className="singlePets">
            <Header user={this.props.user} login={this.props.login} logout={this.props.logout} loggedIn={this.props.loggedIn} location={this.props.location} breeds={this.props.breeds} getPets={this.props.getPets}/>
                <h1>{this.state.animal.name}</h1>
                <img src={this.state.animal.photo} alt={`a photo of ${this.state.animal.name}`}/>
                <h3>{this.state.animal.breed}</h3>
                <h3>{this.state.animal.sex}</h3>
                <p>{this.state.animal.description}</p>
                <a href={`mailto: ?body=Check out this cute pet! www.critter.com/pet/${this.props.match.params.pet_id}&subject=cute pet`}>Send to a Friend</a>
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="Check out this awesome critter available for adoptiong!" data-hashtags="CritterApp" data-show-count="false">Tweet</a>

                <Link to='/results'>Back to results</Link>

                {
                    this.props.isFavorite(this.state.animal) ?
                    <button onClick={() => this.getKey(this.state.animal.id)}>REMOVE FROM FAVES</button>
                    : this.state.user ? 
                    <button onClick={() => this.props.addToFaves(this.state.animal)} >ADD TO FAVES</button>
                    : <button onClick={this.props.login}> LOG IN TO ADD TO FAVES</button>

                }
              
            </div>
        )
    }
}

export default singlePets;