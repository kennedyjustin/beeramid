import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class BeeramidHand extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: props.cards,
      exposeCard: props.exposeCard
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cards: nextProps.cards,
      exposeCard: nextProps.exposeCard
    });
  }

  render() {

    const cards = this.state.cards.map((card, i) => {
      let cardAttributes = {}
      if (card) {
        cardAttributes['rank'] = card['rank']
        cardAttributes['suit'] = card['suit']
        cardAttributes['new'] = card['new']
      } else {
        cardAttributes['hidden'] = true
      }

      let exposeAttributes = {}
      if (this.state.exposeCard) {
        exposeAttributes['onClick'] = () => {
          this.state.exposeCard(i)
        }
      }

      return (
        <Col xs="auto">
          <a {...exposeAttributes}>
            <Card {...cardAttributes}/>
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

export default BeeramidHand
