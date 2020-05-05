const Game = require('./Game')
const AustraliaPlayer = require('./AustraliaPlayer')
const Deck = require('./Deck')

const NAME = 'Australia'
const MAX_PLAYERS = 5
const NUM_BOTTOM_CARDS = NUM_TOP_CARDS = MIN_CARDS_IN_HAND = 3
const TAKE = 'take'
const LEAVE = 'leave'
const TWO = '2'
const TEN = '10'
const MAX_INDEX = 100
const NUM_CARDS_TO_CLEAR = 4

module.exports = class Australia extends Game {
  constructor(players, hostId, endGame) {
    super(AustraliaPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.winner = null
    this.initializeRound()
  }

  getName() {
    return NAME
  }

  initializeRound() {
    this.round = this.getRoundName()
    this.deck = new Deck(false)
    this.firstCardFlipped = false
    this.pickupPile = []
    this.currentPlayer = null
    this.previousPlayer = null
    this.deal()
    // TODO: Remove
    this.deck.getCards(52 - (this.getPlayers().length * 9) - 1)
  }

  deal() {
    this.getPlayers().forEach(player => {
      if (!player.isOut()) {
        player.setBottomCards(this.deck.getCards(NUM_BOTTOM_CARDS))
        player.addToHand(this.deck.getCards(NUM_TOP_CARDS + MIN_CARDS_IN_HAND))
      }
    })
  }

  flipFirstCard(player) {
    if (player.isReady() && !this.firstCardFlipped) {
      this.pickupPile.push(this.deck.getCards(1))
      this.firstCardFlipped = true
      this.triggerGameUpdate()
    }
  }

  play(player, cards) {

    if (!player.isReady() || !this.firstCardFlipped || (this.currentPlayer != null && player.getUuid() != this.currentPlayer)) {
      return
    }
    this.setCurrentPlayerIfFirstCard(player)

    const isBottomCard = cards['bottomCards'].length > 0
    let isHand, isTopCard

    // Check all cards are the same
    let handRank, topCardsRank
    if (cards['hand'].length > 0) {
      handRank = player.getHand()[cards['hand'][0]]['rank']
      isHand = true
      if (!cards['hand'].every(c => player.getHand()[c]['rank'] == handRank)) {
        return
      }
    }

    if (cards['topCards'].length > 0) {
      topCardsRank = player.getTopCards()[cards['topCards'][0]]['rank']
      isTopCard = true
      if (!cards['topCards'].every(c => player.getTopCards()[c]['rank'] == topCardsRank)) {
        return
      }
    }

    if (cards['hand'].length > 0 && cards['topCards'].length > 0) {
      if (handRank != topCardsRank) {
        return
      }
    }

    // Check card rank is greater than the card rank of pickupPile
    let rank
    if (isBottomCard) {
      rank = player.getBottomCards()[cards['bottomCards'][0]]['rank']
    } else {
      rank = handRank ? handRank : topCardsRank
    }

    let bottomCardPickup = false
    if (this.pickupPile.length > 0 && !this.isRankHigherThanOrEqual(rank, this.pickupPile[this.pickupPile.length - 1]['rank'])) {
      if (isBottomCard) {
        bottomCardPickup = true
      } else {
        return
      }
    }

    // Place all cards on pickupPile, remove from hand / topCards / bottomCards
    if (isBottomCard) {
      this.pickupPile.push(player.getBottomCards()[cards['bottomCards'][0]])
      player.removeFromBottomCards(cards['bottomCards'][0])
    } else {
      if (isTopCard) {
        cards['topCards'].forEach(cardIndex => {
          this.pickupPile.push(player.getTopCards()[cardIndex])
          player.removeFromTopCards(cardIndex)
        })
      }
      if (isHand) {
        cards['hand'].forEach(cardIndex => {
          this.pickupPile.push(player.getHand()[cardIndex])
        })
        player.removeFromHand(cards['hand'])
      }
    }

    if (bottomCardPickup) {
      this.pickup(player)
      this.triggerGameUpdate()
      return
    }

    // Clear pickupPile if 10 or 4 cards in a row
    let cleared
    if (this.checkFourCardClear() || this.pickupPile[this.pickupPile.length - 1]['rank'] == TEN) {
      this.pickupPile = []
      cleared = true
    }

    // If deck left add back into hand
    this.replenishHand(player)

    // Check if player won, and if round is over
    if (player.checkIfWon()) {
      player.setWon(true)
      const lastPlayer = this.findLastPlayerLeftInRound()
      if (lastPlayer) {
        this.endRound(lastPlayer)
        this.triggerGameUpdate()
        return
      }
    }

    // If not 2, 10, or clear, set next() (unless player is out)
    if ((rank != TWO && rank != TEN && !cleared) || player.getWon()) {
      this.next()
    }

    this.triggerGameUpdate()
  }

  replenishHand(player) {
    if (!this.deck.isEmpty() && player.getHand().length < MIN_CARDS_IN_HAND) {
      player.addToHand([this.deck.getCards(1)])
      this.replenishHand(player)
    }
  }

  checkFourCardClear() {
    if (this.pickupPile.length >= NUM_CARDS_TO_CLEAR) {
      const rank = this.pickupPile[this.pickupPile.length - 1]['rank']
      return this.pickupPile.slice(this.pickupPile.length - NUM_CARDS_TO_CLEAR, this.pickupPile.length).every(card => card['rank'] == rank)
    }
    return false
  }

  isRankHigherThanOrEqual(rank1, rank2) {
    let index1 = this.deck.getRanks().indexOf(rank1)
    if (rank1 == TWO || rank1 == TEN) {
      index1 = MAX_INDEX
    }
    let index2 = this.deck.getRanks().indexOf(rank2)
    if (rank2 == TEN) {
      index2 = 0
    }
    return index1 >= index2
  }

  sneakIn(player, cards) {
    if (!player.isReady() || !player.getUuid() === this.previousPlayer) {
      return
    }

    //TODO: Implement
  }

  pickup(player) {
    if (!player.isReady()) {
      return
    }
    this.setCurrentPlayerIfFirstCard(player)
    if (player.getUuid() === this.currentPlayer && !this.pickupPile.length == 0) {
      player.addToHand(this.pickupPile.slice())
      this.pickupPile = []
      this.next()
      this.triggerGameUpdate()
    }
  }

  setCurrentPlayerIfFirstCard(player) {
    if (this.currentPlayer === null && this.previousPlayer === null) {
      this.currentPlayer = player.getUuid()
    }
  }

  next() {
    let currentPlayerFound = false
    let index = -1
    while (true) {
      index++
      if (index == this.getPlayers().length) {
        index = 0
      }

      if (this.getPlayers()[index].getUuid() === this.currentPlayer) {
        currentPlayerFound = true
        continue
      } else if (currentPlayerFound && !this.getPlayers()[index].isOut() && !this.getPlayers()[index].getWon()) {
        this.previousPlayer = this.currentPlayer.slice()
        this.currentPlayer = this.getPlayers()[index].getUuid()
        break
      }
    }
  }

  findLastPlayerLeftInRound() {
    const playersStillIn = []
    this.getPlayers().forEach(player => {
      if (!player.getWon() && !player.isOut()) {
        playersStillIn.push(player)
      }
    })
    if (playersStillIn.length == 1) {
      return playersStillIn[0]
    }
    return null
  }

  getRoundName() {
    const numPlayersStillIn = this.getPlayersStillIn()
    switch (numPlayersStillIn) {
      case 2:
        return "Finals"
      default:
        return "Round " + (this.getPlayers().length - numPlayersStillIn + 1) + " (" + numPlayersStillIn + " players left)"
    }
  }

  getPlayersStillIn() {
    let numPlayersStillIn = 0
    this.getPlayers().forEach(player => {
      if (!player.isOut()) {
        numPlayersStillIn++
      }
    })
    return numPlayersStillIn
  }

  findWinner() {
    let playerName
    this.getPlayers().forEach(player => {
      if (!player.isOut()) {
        playerName = player.getName()
      }
    })
    return playerName
  }

  endRound(lastPlayer) {
    lastPlayer.setOut(true)
    const lastPlayerWasHost = lastPlayer.getIsHost()
    if (this.getPlayersStillIn() == 1) {
      this.winner = this.findWinner()
    } else {
      let newHostSet = false
      this.getPlayers().forEach(player => {
        player.reset()
        if (lastPlayerWasHost && !newHostSet && !player.isOut()) {
          this.setHost(player)
          lastPlayer.setIsHost(false)
          newHostSet = true
        }
      })
      this.initializeRound()

    }
  }

  setCustomEventHandlers(player) {
    player.setflipFirstCard(this.flipFirstCard.bind(this))
    player.setPlay(this.play.bind(this))
    player.setPickup(this.pickup.bind(this))
    player.setSneakIn(this.sneakIn.bind(this))
  }

  getAllPlayerInfo(exceptUuid) {
    const playerIndex = this.getPlayers().findIndex((p => p.getUuid() == exceptUuid))
    const sortedPlayers = this.getPlayers().slice(playerIndex + 1).concat(this.getPlayers().slice(0, playerIndex))

    let playersStillPlaying = []
    let playersGoingToNextRound = []
    let spectatingPlayers = []
    sortedPlayers.forEach(player => {
      if (!player.isOut() && !player.getWon()) {
        playersStillPlaying.push(player)
      } else if (!player.isOut() && player.getWon()) {
        playersGoingToNextRound.push(player)
      } else {
        spectatingPlayers.push(player)
      }
    })

    const finalList = playersStillPlaying.concat(playersGoingToNextRound.concat(spectatingPlayers))
    return finalList.map(player => {
      return {
        name: player.getName(),
        topCards: player.getTopCards(),
        cardsInHand: player.getHand().length,
        currentPlayer: (player.getUuid() === this.currentPlayer),
        previousPlayer: (player.getUuid() === this.previousPlayer),
        out: player.isOut(),
        won: player.getWon()
      }
    })
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(player.getUuid()),
        name: player.getName(),
        isHost: player.getIsHost(),
        hand: player.getHand(),
        deckLeft: this.deck.cardsLeft(),
        pickupPile: this.pickupPile.slice().reverse(),
        topCards: player.getTopCards(),
        bottomCards: player.getBottomCards().map((card) => card ? true : false),
        currentPlayer: (player.getUuid() === this.currentPlayer),
        previousPlayer: (player.getUuid() === this.previousPlayer),
        ready: player.isReady(),
        out: player.isOut(),
        won: player.getWon(),
        winner: this.winner,
        round: this.round
      })
    })
  }
}
