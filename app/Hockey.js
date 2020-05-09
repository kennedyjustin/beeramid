import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

class Hockey extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h1>Hockey</h1>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Hockey
