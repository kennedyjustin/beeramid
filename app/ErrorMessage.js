import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

class ErrorMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: props.message
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: nextProps.message
    })
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h1>Error</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <p>{this.state.message}</p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default ErrorMessage
