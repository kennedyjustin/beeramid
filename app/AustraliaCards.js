import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class AustraliaCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectCard: props.selectCard,
      topCards: props.topCards,
      selectedCards: props.selectedCards
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectCard: nextProps.selectCard,
      topCards: nextProps.topCards,
      selectedCards: nextProps.selectedCards
    })
  }

  render() {

    const cards = this.state.topCards.map((card, i) => {
      if (card) {
        return (
          <a onClick={() => this.state.selectCard('topCards', i)}>
            <Card
              rank={card['rank']}
              suit={card['suit']}
              selected={this.state.selectedCards.includes(i)}
            />
          </a>
        )
      } else {
        return (
          <a onClick={() => this.state.selectCard('topCards', i)}>
            <Card
              hidden
              selected={this.state.selectedCards.includes(i)}
            />
          </a>
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
