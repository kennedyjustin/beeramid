import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class Pyramid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pyramid: [],
      nextStage: props.nextStage
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pyramid: nextProps.pyramid,
      nextStage: nextProps.nextStage
    });
  }

  getAttributes(index) {
    let attributes = {}
    if (index == this.state.pyramid.length) {
      attributes["onClick"] = () => {
        this.state.nextStage()
      }
    }
    return attributes
  }

  getCardAttributes(index) {
    let attributes = {}
    if (this.state.pyramid.length > index) {
      attributes['rank'] = this.state.pyramid[index]['rank']
      attributes['suit'] = this.state.pyramid[index]['suit']
    } else {
      attributes['hidden'] = true
    }
    return attributes
  }

  getRow(indices, justification) {
    const columns = indices.map(index => {
      return (
        <Col xs="auto">
          <a {...this.getAttributes(index)}>
            <Card {...this.getCardAttributes(index)}/>
          </a>
        </Col>
      )
    })
    return (
      <Row noGutters className={justification}>
        {columns}
      </Row>
    )
  }

  render() {

    return (
      <Container fluid>
        {this.getRow([10, 9, 11], 'justify-content-between')}
        {this.getRow([7, 8], 'justify-content-center')}
        {this.getRow([4, 5, 6], 'justify-content-center')}
        {this.getRow([0, 1, 2, 3], 'justify-content-center')}
      </Container>
    )
  }
}

export default Pyramid
