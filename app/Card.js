import React, { Component } from 'react';
import { Image } from 'react-bootstrap'

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rank: props.rank,
      suit: props.suit,
      hidden: props.hidden,
      new: props.new
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rank: nextProps.rank,
      suit: nextProps.suit,
      hidden: nextProps.hidden,
      new: nextProps.new
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

    let classes = 'playing-card'
    if (this.state.new) {
      classes += ' new-card'
    }

    return (
      <Image className={classes} src={value} rounded />
    )
  }
}

export default Card
