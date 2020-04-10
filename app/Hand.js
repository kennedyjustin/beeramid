import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class Hand extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: props.cards
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cards: nextProps.cards
    });
  }

  render() {

    const cards = this.state.cards.map(card => {
      let attributes = {}
      if (card) {
        attributes['rank'] = card['rank']
        attributes['suit'] = card['suit']
      } else {
        attributes['hidden'] = true
      }
      return (
        <Col xs="auto">
          <a>
            <Card {...attributes}/>
          </a>
        </Col>
      )
    })

    return (
      <Container fluid>
        <Row noGutters className="justify-content-center">
          {cards}
        </Row>
      </Container>
    )
  }
}

export default Hand
