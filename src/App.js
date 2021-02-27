import logo from './logo.svg';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Table, Navbar, Nav, ListGroup} from "react-bootstrap";
import {BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'


class App extends React.Component{
    state = {'customers':[], 'films':[]}


    componentDidMount() {
        let BASE_URL = "http://localhost:5000"
         fetch(BASE_URL+"/customer", { method: 'get', mode: 'cors' })
             .then(response => response.json())
             .then( data => this.setState({customers: data.data}))
         fetch(BASE_URL+"/film", { method: 'get', mode: 'cors' })
             .then(response => response.json())
             .then( data => this.setState({films: data.data}))
    }

    render(){
        return (
            <div>
                <Router>
                    <Navbar bg="dark">
                        <Nav.Link href="/customer">Customer</Nav.Link>

                        <Nav.Link href="/films">Films</Nav.Link>
                    </Navbar>
                    <Switch>
                          <Route exact path="/">
                                <Customer customer={this.state.customers}/>
                          </Route><Route path="/customer">
                                <Customer customer={this.state.customers}/>
                          </Route>
                          <Route path="/films">
                            <Film film={this.state.films} />
                          </Route>
                        <Route path="/customer_details/:id" component={CustomerDetails} />
                        <Route path="/movie_details/:id" component={MovieDetails} />
                    </Switch>
                </Router>
            </div>
        )
    }
}


class Customer extends React.Component{

     constructor(props) {
            super(props);
        }

    render() {
         return (
             <Container>
                 <h1 className={"text-center"}>Customers</h1>
                 <Table striped bordered hover>
                     <thead>
                      <th>First Name</th>
                      <th>Last Name</th>
                     </thead>
                       <tbody>
                        {this.props.customer.map((cus)=>{
                            return <tr key={cus._id}>
                                <td><Link to={"/customer_details/"+ cus._id}>{cus["First Name"]}</Link></td>
                                <td><Link to={"/customer_details/"+ cus._id}>{cus["Last Name"]}</Link></td>
                                </tr>

                          })}

                       </tbody>
                 </Table>

             </Container>
         )
    }
}

class Film extends React.Component{

     constructor(props) {
            super(props);
        }

    render() {
         return (
             <Container>
                 <h1 className={"text-center"}>Movies</h1>
                 <Table striped bordered hover>
                     <thead>
                      <th>Movie Title</th>
                      <th>Movie Description</th>
                      <th>Movie Category</th>
                      <th>Movie Rating</th>
                      <th>Movie Rental Duration</th>
                     </thead>
                       <tbody>
                        {this.props.film.map((film)=>{
                            return <tr key={film._id}>
                                <td><Link to={"/movie_details/"+film._id}>{film["Title"]}</Link></td>

                                <td><Link to={"/movie_details/"+film._id}>{film["Description"]}</Link></td>

                                <td><Link to={"/movie_details/"+film._id}>{film["Category"]}</Link></td>

                                <td><Link to={"/movie_details/"+film._id}>{film["Rating"]}</Link></td>

                                <td><Link to={"/movie_details/"+film._id}>{film["Rental Duration"]}</Link></td>
                            </tr>
                          })}

                       </tbody>
                 </Table>

             </Container>
         )
    }
}

class CustomerDetails extends React.Component{
    state = {customer : {}, rentals: []}
    componentDidMount(){
        let BASE_URL = "http://localhost:5000"
        fetch(BASE_URL+"/customer/"+this.props.match.params.id, { method: 'get', mode: 'cors' })
             .then(response => response.json())
             .then( data => this.setState({customer: data.data[0], rentals:data.data[0]["Rentals"]}))

    }
    getDays(d2, d1){
        const diffTime = Math.abs(new Date(d2) - new Date(d1));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    render() {
        return (
            <div>
                <Container>
                    <h1 className={"text-center"}>Customer Details</h1>
                        <ListGroup>
                            <ListGroup.Item>First Name: {this.state.customer["First Name"]}</ListGroup.Item>
                            <ListGroup.Item>Last Name: {this.state.customer["Last Name"]}</ListGroup.Item>
                            <ListGroup.Item>Phone: {this.state.customer["Phone"]}</ListGroup.Item>
                            <ListGroup.Item>Address: {this.state.customer["Address"]}</ListGroup.Item>
                            <ListGroup.Item>City: {this.state.customer["City"]}</ListGroup.Item>
                            <ListGroup.Item>Country: {this.state.customer["Country"]}</ListGroup.Item>
                            <ListGroup.Item>District: {this.state.customer["District"]}</ListGroup.Item>
                        </ListGroup>
                    <h1 className={"text-center"}>Rented Movies</h1>
                        <ListGroup>
                            {this.state.rentals.map((movie)=>{
                               return <ListGroup.Item>
                                   <ListGroup>
                                       <ListGroup.Item>Title: {movie["Film Title"]}</ListGroup.Item>
                                       <ListGroup.Item>Duration: {this.getDays(movie["Return Date"], movie["Rental Date"])} days</ListGroup.Item>
                                       <ListGroup.Item>Rental Cost: ${parseFloat(movie["Payments"][0]["Amount"]).toFixed(2)}</ListGroup.Item>
                                   </ListGroup>
                               </ListGroup.Item>
                            })}

                        </ListGroup>
                </Container>
            </div>
        )
    }
}

class MovieDetails extends React.Component{
    state = {customers : [], movie: {}, actors:[]}
    componentDidMount(){
        let BASE_URL = "http://localhost:5000"
        fetch(BASE_URL+"/film/"+this.props.match.params.id, { method: 'get', mode: 'cors' })
             .then(response => response.json())
             .then( data => this.setState({movie: data.data[0], actors: data.data[0]["Actors"], customers: data.customers}))

    }
    render(){
        return (
            <div>
                <Container>
                    <h1 className={"text-center"}>Film Details</h1>
                        <ListGroup>
                            <ListGroup.Item>Category: {this.state.movie["Category"]}</ListGroup.Item>
                            <ListGroup.Item>Title: {this.state.movie["Title"]}</ListGroup.Item>
                            <ListGroup.Item>Description: {this.state.movie["Description"]}</ListGroup.Item>
                            <ListGroup.Item>Rental Duration(days): {this.state.movie["Rental Duration"]}</ListGroup.Item>
                            <ListGroup.Item>Rating: {this.state.movie["Rating"]}</ListGroup.Item>
                            <ListGroup.Item>Length(Minutes): {this.state.movie["Length"]}</ListGroup.Item>
                            <ListGroup.Item>Replacement Cost: ${this.state.movie["Replacement Cost"]}</ListGroup.Item>
                            <ListGroup.Item>Special Features: {this.state.movie["Special Features"]}</ListGroup.Item>
                            <ListGroup.Item>Actors: {this.state.actors.map((ac)=>{
                                return <span>{ac["First name"] + " " + ac["Last name"]}, </span>
                            })}</ListGroup.Item>
                        </ListGroup>

                    <h1 className={"text-center"}>Rented by</h1>
                    <ListGroup>
                        {this.state.customers.map((customer)=>{
                            return <ListGroup.Item>Name: {customer["First Name"] +" "+ customer["Last Name"]}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Container>

            </div>
        )}
}

export default App;
