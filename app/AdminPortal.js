import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

class AdminPortal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lobbies: props.data['lobbies'],
      dailyActiveUsers: props.data['dailyActiveUsers']
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lobbies: nextProps.data['lobbies'],
      dailyActiveUsers: nextProps.data['dailyActiveUsers']
    })
  }

  render() {
    let lobbies
    if (Object.keys(this.state.lobbies).length === 0) {
      lobbies = (
        <p>No active lobbies</p>
      )
    } else {
      lobbies = Object.keys(this.state.lobbies).map(l => {
        let lobbyName
        if (l === "/") {
          lobbyName = "default"
        } else {
          lobbyName = l.slice(1,-1)
        }
        return (
          <p>{lobbyName + ": " + this.state.lobbies[l]}</p>
        )
      })
    }

    return (
      <Container fluid>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h1>Admin Portal</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h3>Lobbies</h3>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            {lobbies}
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h3>Daily Active Users</h3>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            {this.state.dailyActiveUsers + ' users'}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default AdminPortal
