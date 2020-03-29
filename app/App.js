import React, { Component } from 'react';
import io from 'socket.io-client';
import { Navbar, Container } from 'react-bootstrap'

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "BIG TIME DRINK",
    };
  }

  render() {
    return (
        <div>
          <Navbar bg="dark" variant="dark"><Navbar.Brand>
            Beeramid
          </Navbar.Brand></Navbar>
          <Container fluid>
            {this.state.text}
          </Container>
        </div>
    )
  }
}

export default App
