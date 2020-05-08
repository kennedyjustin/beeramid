import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap'
import Sound from 'react-sound'

class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      name: props.name,
      players: props.players,
      gamePlaying: props.gamePlaying,
      games: props.games
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      socket: nextProps.socket,
      name: nextProps.name,
      players: nextProps.players,
      gamePlaying: nextProps.gamePlaying,
      games: nextProps.games
    });
  }

  startGame(event) {
    event.preventDefault()
    this.state.socket.emit('startGame', {
      game: event.target.id
    })
  }

  render() {
    let lobbyMembers = 0
    const lobbyList = this.state.players.map(player => {
      if (player['name']) {
        lobbyMembers++
        return (
          <ListGroup.Item>
            {player['name'] + ' ' + (player['inGame'] ? '(currently playing)' : '')}
          </ListGroup.Item>
        )
      }
    })

    let startButtons
    if (lobbyMembers >= 2 && !this.state.gamePlaying) {
      startButtons = Object.keys(this.state.games).map(game => {
        let buttonClass = ''
        if (this.state.games[game]['enabled'] && this.state.games[game]['new']) {
          buttonClass = 'rainbow'
        }
        return (
          <Row>
            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
              <Button
                id={game}
                className={buttonClass}
                variant={this.state.games[game]['enabled'] ? 'primary' : 'secondary'}
                disabled={this.state.games[game]['enabled'] ? false : true}
                onClick={this.startGame.bind(this)}
              >
                {'Start ' + game}
              </Button>
            </Col>
          </Row>
        )
      })
    }

    return (
      <Container fluid>
        <Sound
          url="/assets/tpb.mp3"
          playStatus={Sound.status.PLAYING}
          loop={true}
        />
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h1>Lobby</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <ListGroup>
              {lobbyList}
            </ListGroup>
          </Col>
        </Row>
        {startButtons}
      </Container>
    )
  }
}

export default Lobby
