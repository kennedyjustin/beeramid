import React, { Component } from 'react';
import { Image } from 'react-bootstrap'

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rank: props.rank,
      suit: props.suit,
      hidden: props.hidden,
      new: props.new,
      index: props.index,
      deckLeft: props.deckLeft,
      selected: props.selected
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rank: nextProps.rank,
      suit: nextProps.suit,
      hidden: nextProps.hidden,
      new: nextProps.new,
      index: nextProps.index,
      deckLeft: nextProps.deckLeft,
      selected: nextProps.selected
    });
  }

  render() {

    let value = '/assets/'
    if (this.state.hidden) {
      value += 'red_back'
    } else {
      value += this.state.rank + this.state.suit
    }
    value += '.png'

    let classes = 'playing-card'
    if (this.state.new) {
      classes += ' new-card'
    }

    if (this.state.selected) {
      classes += ' selected-card'
    }

    let style = {}
    if (this.state.index !== undefined) {
      classes += ' flip-card'
      style['animation-delay'] = this.state.index + '00ms'
    }

    if (this.state.deckLeft) {
      const px = (this.state.deckLeft / 52) * 10
      style['box-shadow'] = px + 'px 0px #949495'
      style['margin-right'] = (px + 5) + 'px'
    }

    return (
      <Image className={classes} src={value} style={style} rounded />
    )
  }
}

export default Card
