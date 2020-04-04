import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

class PreLobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      name: null
    }
  }

  nameChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  enterName(event) {
    event.preventDefault()
    if (this.state.name) {
      this.state.socket.emit('name', {
        name: this.state.name
      })
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
          <Form onSubmit={this.enterName.bind(this)}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="big time" onChange={this.nameChange.bind(this)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enter Lobby
            </Button>
          </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default PreLobby
