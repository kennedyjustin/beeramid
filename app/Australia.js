import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import DeckAndPickupPile from './DeckAndPickupPile'
import AustraliaHand from './AustraliaHand'
import AustraliaCards from './AustraliaCards'
import AustraliaPlayers from './AustraliaPlayers'

class Australia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      name: props.name,
      players: [],
      isHost: false,
      hand: [],
      pickupPile: [],
      deckLeft: 52,
      topCards: [null, null, null],
      currentPlayer: false,
      previousPlayer: false,
      ready: false,
      selectedCards: {
        'hand': [],
        'topCards': []
      }
    }

    this.state.socket.on('gameUpdate', (data) => this.gameUpdate(data))
  }

  gameUpdate(data) {
    this.setState({
      name: data.name,
      players: data.players,
      isHost: data.isHost,
      hand: data.hand,
      pickupPile: data.pickupPile,
      deckLeft: data.deckLeft,
      topCards: data.topCards,
      currentPlayer: data.currentPlayer,
      previousPlayer: data.previousPlayer,
      ready: data.ready
    })
  }

  endGame() {
    this.state.socket.emit('endGame', {})
  }

  flipFirstCard() {
    if (!this.state.ready) {
      return
    }
    this.state.socket.emit('flipFirstCard', {})
  }

  setTopCards() {
    if (this.state.selectedCards['hand'].length < 3) {
      return
    }
    this.state.socket.emit('setTopCards', {
      indices: this.state.selectedCards['hand']
    })
    this.setState({
      selectedCards: {
        'hand': [],
        'topCards': []
      }
    })
  }

  pickup() {
    this.state.socket.emit('pickup', {})
  }

  play() {
    this.state.socket.emit('play', {
      'hand': this.state.selectedCards['hand'],
      'topCards': this.state.selectedCards['topCards']
    })
    this.setState({
      selectedCards: {
        'hand': [],
        'topCards': []
      }
    })
  }

  selectCard(where, cardIndex) {
    if (this.state.ready && where === 'topCards') {
      if (this.state.topCards.every(card => card === null)) {
        if (!this.canBottomCardBeSelected()) {
          return
        }
      } else {
        if (!this.canTopCardBeSelected(cardIndex)) {
          return
        }
      }
    }

    const selectedCards = {}
    selectedCards['hand'] = this.state.selectedCards['hand'].slice()
    selectedCards['topCards'] = this.state.selectedCards['topCards'].slice()

    if (this.state.selectedCards[where].includes(cardIndex)) {
      const i = this.state.selectedCards[where].indexOf(cardIndex)
      selectedCards[where].splice(i, 1)
      this.setState({
        selectedCards: selectedCards
      })
    } else {
      if (!this.state.ready && (where !== 'hand' || this.state.selectedCards['hand'].length >= 3)) {
        return
      } else if (this.state.ready && this.state.selectedCards['hand'].length > 0 && !this.isSelectedCardSameRank(cardIndex)) {
        return
      }
      selectedCards[where] = selectedCards[where].concat(cardIndex)
      this.setState({
        selectedCards: selectedCards
      })
    }
  }

  isSelectedCardSameRank(cardIndex) {
    return this.state.selectedCards['hand'].every(c => this.state.hand[c]['rank'] == this.state.hand[cardIndex]['rank'])
  }

  canBottomCardBeSelected() {
    return this.state.hand.length != 0 || this.state.selectedCards['topCards'].length >= 1
  }

  canTopCardBeSelected(cardIndex) {
    if (this.state.hand.length == 0) {
      return true
    }

    const allCardsInHandSelected = this.state.hand.length == this.state.selectedCards['hand'].length
    const allCardsInHandSameAsTopCard = this.state.hand.every(c => c['rank'] == this.state.topCards[cardIndex]['rank'])

    if (allCardsInHandSelected && allCardsInHandSameAsTopCard) {
      return true
    } else {
      return false
    }
  }

  render() {
    let setOrPlayButton
    if (this.state.ready) {
      if (this.state.selectedCards['hand'].length > 0 || this.state.selectedCards['topCards'].length > 0) {
        let setOrPlayButtonName
        if (this.state.selectedCards['hand'].length + this.state.selectedCards['topCards'].length > 1) {
          setOrPlayButtonName = 'Play Cards'
        } else {
          setOrPlayButtonName = 'Play Card'
        }
        setOrPlayButton = (
          <Row>
            <Col className="text-center">
              <Button variant="primary" onClick={this.play.bind(this)}>
                {setOrPlayButtonName}
              </Button>
            </Col>
          </Row>

        )
      }
    } else {
      if (this.state.selectedCards['hand'].length === 3) {
        setOrPlayButton = (
          <Row>
            <Col className="text-center">
              <Button variant="primary" onClick={this.setTopCards.bind(this)}>
                Set Top Cards
              </Button>
            </Col>
          </Row>
        )
      }
    }

    let finalHr
    let endButton
    if (this.state.isHost) {
      finalHr = (<hr />)
      endButton = (
        <Button variant="primary" onClick={this.endGame.bind(this)}>
          End Game
        </Button>
      )
    }

    let blinkingAttributes = {}
    if (this.state.currentPlayer) {
      blinkingAttributes['className'] = 'current-player'
    }

    return (
      <Container fluid>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <DeckAndPickupPile
              flipFirstCard={this.flipFirstCard.bind(this)}
              pickup={this.pickup.bind(this)}
              deckLeft={this.state.deckLeft}
              pickupPile={this.state.pickupPile}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <p {...blinkingAttributes}>Final Cards</p>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <AustraliaCards
              selectCard={this.selectCard.bind(this)}
              topCards={this.state.topCards}
              selectedCards={this.state.selectedCards['topCards']}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <p {...blinkingAttributes}>Hand</p>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <AustraliaHand
              selectCard={this.selectCard.bind(this)}
              hand={this.state.hand}
              selectedCards={this.state.selectedCards['hand']}
            />
          </Col>
        </Row>
        {setOrPlayButton}
        <hr />
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <AustraliaPlayers
              players={this.state.players}
            />
          </Col>
        </Row>
        {finalHr}
        <Row>
          <Col className="text-center">
            {endButton}
          </Col>
        </Row>
        <Row></Row>
      </Container>
    )
  }
}

export default Australia
