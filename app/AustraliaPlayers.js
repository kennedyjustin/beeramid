import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Card from './Card'

class AustraliaPlayers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: props.players
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      players: nextProps.players
    })
  }

  render() {

    const players = this.state.players.map(player => {

      let handCard
      if (player['cardsInHand'] > 0) {
        handCard = (
          <Card hidden />
        )
      }

      let handValue
      if (player['cardsInHand'] > 1) {
        handValue = (
          <p className="extra-cards-left">{'x ' + player['cardsInHand']}</p>
        )
      }

      const topCards = player['topCards'].map(card => {
        if (card) {
          return (
            <Card rank={card['rank']} suit={card['suit']} />
          )
        } else {
          return (
            <Card hidden />
          )
        }
      })

      return (
        <div>
          <Row className="align-items-center">
            <Col className="text-center">
              <p><u>{player['name']}</u></p>
            </Col>
          </Row>
          <Row noGutters className="justify-content-between align-items-center d-flex">
            <Col xs="auto" className="mr-auto">
              {topCards}
            </Col>
            <Col xs="auto">
              {handCard}
            </Col>
            <Col xs="auto">
              {handValue}
            </Col>
          </Row>
        </div>
      )
    })

    return (
      <Container fluid>
        {players}
      </Container>
    )
  }
}

export default AustraliaPlayers
