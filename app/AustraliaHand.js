import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class AustraliaHand extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectCard: props.selectCard,
      hand: props.hand,
      selectedCards: props.selectedCards
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectCard: nextProps.selectCard,
      hand: nextProps.hand,
      selectedCards: nextProps.selectedCards
    })
  }

  render() {

    const hand = this.state.hand.map((card, i) => {
      return (
        <a onClick={() => this.state.selectCard('hand', i)}>
          <Card
            rank={card['rank']}
            suit={card['suit']}
            new={card['new']}
            selected={this.state.selectedCards.includes(i)}
          />
        </a>
      )
    })

    return (
      <Container>
        <Row>
          <Col>
            {hand}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default AustraliaHand
