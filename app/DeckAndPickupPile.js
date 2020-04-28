import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

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

    const pickupPile = this.state.pickupPile.map(card => {
      //TODO: Make Pickup pile clickable, figure out design
      return (
        <Card rank={card['rank']} suit={card['suit']}/>
      )
    })

    return (
      <Container>
        <Row noGutters className="justify-content-start">
          <Col xs="auto">
            <a onClick={this.state.flipFirstCard}>
              <Card hidden deckLeft={this.state.deckLeft} />
            </a>
          </Col>
          <Col xs="auto">
            {pickupPile}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default DeckAndPickupPile
