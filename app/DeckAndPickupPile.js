import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

const MAX_PICKUP_CARDS = 4

class DeckAndPickupPile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flipFirstCard: props.flipFirstCard,
      pickup: props.pickup,
      deckLeft: props.deckLeft,
      pickupPile: props.pickupPile
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flipFirstCard: nextProps.flipFirstCard,
      pickup: nextProps.pickup,
      deckLeft: nextProps.deckLeft,
      pickupPile: nextProps.pickupPile
    })
  }

  render() {

    const pickupPile = this.state.pickupPile.slice(0, MAX_PICKUP_CARDS).map(card => {
      return (
        <a onClick={this.state.pickup}>
          <Card rank={card['rank']} suit={card['suit']}/>
        </a>
      )
    })

    let howManyLeft
    if (this.state.pickupPile.length > MAX_PICKUP_CARDS) {
      const text = '+ ' + (this.state.pickupPile.length - MAX_PICKUP_CARDS)
      howManyLeft = (
        <Col xs="auto" className="extra-cards-left">
          {text}
        </Col>
      )
    }

    let deck
    if (this.state.deckLeft > 0) {
      deck = (
        <Col xs="auto">
          <a onClick={this.state.flipFirstCard}>
            <Card hidden deckLeft={this.state.deckLeft} />
          </a>
        </Col>
      )
    }

    return (
      <Container>
        <Row noGutters className="justify-content-start align-items-center">
          {deck}
          <Col xs="auto">
            {pickupPile}
          </Col>
          {howManyLeft}
        </Row>
      </Container>
    )
  }
}

export default DeckAndPickupPile
