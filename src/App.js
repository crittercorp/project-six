// import packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './Styles/App.css';
import axios from 'axios';
import Qs from 'qs';
import firebase from 'firebase';
import swal from 'sweetalert2'
import userLocation from './userLocation';
import config from './firebase';

// import components
import Landing from './Components/Landing';
import ResultPage from './Components/ResultPage';
import SinglePet from './Components/SinglePet';
import FavePets from './Components/FavePets'
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            loggedIn: false,
            pets: [],
            breeds: {
                reptile: [],
                smallfurry: [],
                bird: []
            },
            location: null,
            faves: []
        }
    }

    componentDidMount() {
        userLocation().then((loc) => {
            console.log(loc);
            this.setState({
                location: loc
            })
        });
        const getBreeds = (animal) => {
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
                    reqUrl: 'https://api.petfinder.com/breed.list',
                    params: {
                        key: '729776b0ff12f97426ef03d015026841',
                        format: 'json',
                        output: 'full',
                        animal: animal,
                    },
                    xmlToJSON: false
                }
            }).then(res => {
                let breeds = res.data.petfinder.breeds.breed.map(breed => {
                    return breed.$t;
                }) ;
                this.setState({
                    breeds: {
                        ...this.state.breeds,
                        [animal]: breeds
                    }
                })
            })    
        }
        getBreeds('reptile');
        getBreeds('smallfurry');
        getBreeds('bird');

        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user}, () => {
                    this.dbRef = firebase.database().ref(this.state.user.uid);

                    this.dbRef.on('value', (snapshot) => {
                        if(snapshot.val()){
                            this.setState({
                                faves: snapshot.val().faves 
                            })
                        }
                    })
                })
            }
        })
    }

    logout = () => {
        swal({
            title: 'Do you want to logout?',
            type: 'warning',
            confirmButtonText: 'LOG OUT'
        })
        .then((res) => {
           let logout = res.value 
            if (logout) {
                // alert('signed out!');
                swal({
                    title: 'Logged out!',
                    type: 'success'
                })
                auth.signOut().then(() => {
                    this.setState({
                        user: null,
                        loggedIn: false
                    });
                })
            }
        }) 
    
    }
    

    login = () => {
        auth.signInWithPopup(provider).then(res => {
            this.setState({
                user: res.user,
                loggedIn: true
            })
        });
    }

    isFavorite = (pet) => {
        const favesList = Object.values(this.state.faves);
        for (let i = 0; i < favesList.length; i++) {
            if (favesList[i].id === pet.id) {
                console.log(true);
                return true;
            }
        }
    }

    addToFaves = (pet) => {
        if (this.isFavorite(pet)) {
            swal({
                type: 'error',
                text: 'This animal is already on your faves!'
            })
        } else {
            firebase.database().ref(`${this.state.user.uid}/faves`).push(pet);
            swal({
                type: 'success',
                text: 'Added to faves!'
            })
        }
    }

    deleteFromFaves = (key) => {
        swal({
            title: 'Do you want to delete this critter?',
            type: 'warning',
            confirmButtonText: 'Delete this critter'
        }).then((res) => {
            if (res.value) {
                swal(
                    'Deleted!'
                )
                firebase.database().ref(`${this.state.user.uid}/faves/${key}`).remove();
            }
        })
    }

    getPets = (location, type, age, sex, breed) => {
        this.setState({
            pets: []
        })
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
                reqUrl: 'https://api.petfinder.com/pet.find',
                params: {
                key: '729776b0ff12f97426ef03d015026841',
                format: 'json',
                output: 'full',
                location: location,
                animal: type,
                age: age,
                count: 100,
                sex: sex,
                breed: breed
                },
                proxyHeaders: {
                'header_params': 'value'
                },
                xmlToJSON: false
            }
        }).then((res) => {
            if(res.data.petfinder.pets.pet) {
                console.log(res.data.petfinder.pets)
                let petsArray = Object.values(res.data.petfinder.pets)
                if (petsArray[0].length) {
                    let pets = petsArray[0].filter((pet) => {
                        return pet.media.photos 
                            && pet.description.$t
                            && pet.breeds.breed.$t
                            && pet.name.$t
                            && pet.id.$t
                            && pet.age.$t
                    });
                    let petsList = pets.map(pet => {
                        return ({
                            name: pet.name.$t,
                            breed: pet.breeds.breed.$t,
                            sex: pet.sex.$t,
                            photo: pet.media.photos.photo[2].$t,
                            id: pet.id.$t,
                            age: pet.age.$t

                        })
                    })
                    this.setState({pets: petsList});
                } else if(petsArray[0].media.photos) {
                    let pet = [ petsArray[0] ]; 
                    let petsList = pet.map(pet => {
                        return ({
                            name: pet.name.$t,
                            breed: pet.breeds.breed.$t,
                            sex: pet.sex.$t,
                            photo: pet.media.photos.photo[2].$t,
                            id: pet.id.$t,
                            age: pet.age.$t
                        })
                    })
                    this.setState({
                        pets: petsList
                    })
                } else {
                    swal({
                        title: 'Sorry, no critters match your criteria',
                        text: 'Try another search.',
                        type: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            } else {
                swal({
                    title: 'Sorry, no critters match your criteria',
                    text: 'Try another search.',
                    type: 'error',
                    confirmButtonText: 'OK'
                })
            }
        })
    }
    
    render() {
        return (
            <Router>
                <div className="App">
                    <Route exact path="/" render={(props) => (
                        <Landing {...props} user={this.state.user} login={this.login} logout={this.logout} breeds={this.state.breeds} getPets={this.getPets} location={this.state.location}/>
                    )}/>

                    <Route path="/pet/:pet_id" render={(props) => (
                        <SinglePet {...props} isFavorite={this.isFavorite} deleteFromFaves={this.deleteFromFaves} addToFaves={this.addToFaves} user={this.state.user} loggedIn={this.state.loggedIn} login={this.login} logout={this.logout} location={this.state.location} breeds={this.state.breeds} getPets={this.getPets} pets={this.state.pets} faves={this.state.faves}/>
                    )} />


                    <Route path="/results" render={() => (
                        <ResultPage user={this.state.user}  login={this.login} logout={this.logout} pets={this.state.pets} location={this.state.location} breeds={this.state.breeds} getPets={this.getPets}/>
                    )} />

                    <Route path="/faves" render={(props) => (
                        <FavePets  {...props} user={this.state.user} login={this.login} logout={this.logout} pets={this.state.pets} location={this.state.location} breeds={this.state.breeds} getPets={this.getPets} faves={this.state.faves} deleteFromFaves={this.deleteFromFaves} />
                    )} />
                </div>
            </Router>
        );
    }
}

export default App;
