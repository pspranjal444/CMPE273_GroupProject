import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { connect } from "react-redux";
import url from '../Url/Url';

//create the Navbar Component
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            email: "",
            role: "",
            search: "",
            profile: [],
            user: [],
            question:"",

        }
        this.handleLogout = this.handleLogout.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }

    questionAdd = (e) => {
        this.setState({
            question:e.target.value
        })
    };

    answerSubmit = (e) => {
        let owner = localStorage.email;
        axios.post(url.url+'questions/create', {question:this.state.question, owner})
        .then(response=>{
            if(response.data)
            {
                alert("Question Submitted");
            }
        })
    };
    

    searchChangeHandler = (e) => {

        const value = e.target.value;

        const params = {

            search: value,


        };
        const options = {
            params,
            headers: {
                'Authorization': localStorage.jwt,

            },
        };
        axios.get(url.url + 'search/profile', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    profile: response.data.profile,

                });


            });

        axios.get(url.url + 'search/user', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    user: response.data.user,

                });


            });
    }


    componentWillMount() {

    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
        this.props.onLogout();
    }
    render() {
        //if Cookie is set render Logout Button
        let navLogin = null;
        if (cookie.load('cookie')) {
            console.log("Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li></li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown"><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /></a>
                        <div class="dropdown-menu">

                            <a class="dropdown-item" href="#">Profile</a>
                            <a class="dropdown-item" href="#">Messages</a>
                            <a class="dropdown-item" href="#"><Link to='/viewquestion'>Your Content</Link></a>
                            
                            <Link to="/" onClick={this.handleLogout} class="dropdown-item">Logout</Link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><button class="btn btn-danger" data-toggle="modal" data-target="#questionModal" type="submit">Add Question or Link</button></a>
                    </li>
                </ul>
            );
        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/login" class="nav-link"><i class='fas fa-user'></i></Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if (cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        if (!cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }





        return (
            <div>
                {redirectVar}
                <nav class="navbar navbar-expand-sm bg-light navbar-light">
                    <div class="container-fluid">
                        <div class="navbar-header">

                            <Link to="/home" class="navbar-brand"><img src="logo.png" height='30' width='120' alt="Profile Pic" /> </Link>
                        </div>

                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class='far fa-file-alt'></i> Home</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class='far fa-edit'></i> Answers</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class='fas fa-bell'></i> Notifications</a>
                            </li>

                            <li class="nav-item dropdown">

                                <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown"><button type="button" class="btn btn-danger"><i class="fa fa-search"></i>   Search Quora</button></a>

                                <div class="dropdown-menu">
                                    <input class="form-control mr-sm-2" type="search" placeholder="Search Quora" onChange={this.searchChangeHandler} />
                                    
                                    {this.state.profile.map(res => {
                                        return (
                                            <div id="empty" class="dropdown-header"><small>Profile : </small><Link to="/" class="dropdown-item">{res.fname}, {res.lname}</Link></div>
                                        )
                                    })
                                    }
                                    <div id="empty" class="dropdown-header"><hr/></div>
                                    {this.state.user.map(res => {
                                        return (
                                            <div id="empty" class="dropdown-header"><small>User : </small> <Link to="/" class="dropdown-item">{res.email}</Link></div>
                                        )
                                    })
                                    }
                                    <div id="empty" class="dropdown-header"><hr/></div>
                                    <div id="empty" class="dropdown-header">Quora Search <a href=""> Terms and Conditions.</a></div>
                                </div>
                            </li>




                        </ul>


                        {navLogin}


                    </div>
                </nav>
                    <div class="modal" id="questionModal">
                            <div class="modal-header">
                                <h5 class="modal-title"><strong>Start your question with "What", "How", "Why", etc.</strong></h5>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                    
                    
                            <div class="modal-body">        
                                <div>
                                    <textarea type="text" class="questionAdd" value={this.state.question} onChange={this.questionAdd.bind(this)} placeholder="Optional: include a link that gives context" />
                                </div>
                            </div>
                    
                    
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" onClick={this.answerSubmit.bind(this)} >Submit</button>
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                
                            </div>
                    </div>
            </div>
        )




    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispachToProps = dispatch => {
    return {
        onLogout: () => dispatch({
            type: "LOGOUT",

        }),

    };
};

//export Home Component
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Navbar);