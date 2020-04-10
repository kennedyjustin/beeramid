import React, { Component } from 'react';
import { Image } from 'react-bootstrap'

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rank: props.rank,
      suit: props.suit,
      hidden: props.hidden
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rank: nextProps.rank,
      suit: nextProps.suit,
      hidden: nextProps.hidden
    });
  }

  render() {

    let value = 'cards/'
    if (this.state.hidden) {
      value += 'blue_back'
    } else {
      value += this.state.rank + this.state.suit
    }
    value += '.png'

    return (
      <Image className="playing-card" src={value} rounded />
    )
  }
}

export default Card
