import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class Pyramid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pyramid: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pyramid: nextProps.pyramid
    });
  }

  getAttributes(index) {
    let attributes = {}
    if (this.state.pyramid.length > index) {
      attributes['rank'] = this.state.pyramid[index]['rank']
      attributes['suit'] = this.state.pyramid[index]['suit']
    } else {
      attributes['hidden'] = true
    }
    return attributes
  }

  render() {
    return (
      <Container fluid>
        <Row noGutters className="justify-content-between">
          <Col xs="auto">
            <Card {...this.getAttributes(10)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(9)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(11)} />
          </Col>
        </Row>
        <Row noGutters className="justify-content-center">
          <Col xs="auto">
            <Card {...this.getAttributes(7)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(8)} />
          </Col>
        </Row>
        <Row noGutters className="justify-content-center">
          <Col xs="auto">
            <Card {...this.getAttributes(4)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(5)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(6)} />
          </Col>
        </Row>
        <Row noGutters className="justify-content-center">
          <Col xs="auto">
            <Card {...this.getAttributes(0)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(1)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(2)} />
          </Col>
          <Col xs="auto">
            <Card {...this.getAttributes(3)} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Pyramid
