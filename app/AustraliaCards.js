import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class AustraliaCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectCard: props.selectCard,
      topCards: props.topCards,
      bottomCards: props.bottomCards,
      selectedTopCards: props.selectedTopCards,
      selectedBottomCards: props.selectedBottomCards
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectCard: nextProps.selectCard,
      topCards: nextProps.topCards,
      bottomCards: nextProps.bottomCards,
      selectedTopCards: nextProps.selectedTopCards,
      selectedBottomCards: nextProps.selectedBottomCards
    })
  }

  render() {

    const cards = [0, 1, 2].map((i) => {
      const topCard = this.state.topCards.length > i ? this.state.topCards[i] : null
      const bottomCard = this.state.bottomCards.length > i ? this.state.bottomCards[i] : null

      if (topCard) {
        return (
          <a onClick={() => this.state.selectCard('topCards', i)}>
            <Card
              rank={topCard['rank']}
              suit={topCard['suit']}
              selected={this.state.selectedTopCards.includes(i)}
            />
          </a>
        )
      } else if (bottomCard) {
        return (
          <a onClick={() => this.state.selectCard('bottomCards', i)}>
            <Card
              hidden
              selected={this.state.selectedBottomCards.includes(i)}
            />
          </a>
        )
      } else {
        return (
          <Card invisible />
        )
      }
    })

    return (
      <Container>
        <Row>
          <Col>
            {cards}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default AustraliaCards
