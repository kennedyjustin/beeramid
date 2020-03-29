import React, { Component } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap'

class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      names: props.names
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      names: nextProps.names
    });
  }

  render() {
    const lobbyList = this.state.names.map(name => {
      if (name) {
        return <ListGroup.Item>{name}</ListGroup.Item>
      }
    })

    return (
      <Container fluid>
        <Row>
          <Col>
            <h1>Lobby</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {lobbyList}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Lobby
