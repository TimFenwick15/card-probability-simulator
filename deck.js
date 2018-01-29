'use strict'
class Deck {
  constructor (deck) {
    this.debug = deck.debug
    this.simulationCount = deck.debug ? 10 : 1e4
    this.originalDeck = deck
    this.results = []
  }
  initialise() {
    // We need to recursively copy the original deck object.
    // As in, some properties of deck are themselves objects which need copying.
    // Using A = Object.assign({}, B) would leave the references to such sub objects intact.
    // So modifying them on A modifies them on B
    // The following is a solution. Thanks to:
    // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
    this.deck = JSON.parse(JSON.stringify(this.originalDeck))

    this.deck.occupiedPositions = new Set()
    this.deck.cardsDrawn = 0
    this.positionCards()
  }
  findUnoccupiedPositions(count) {
    const result = []
    while (result.length !== count) {
      let randomPosition = Math.floor(Math.random() * this.deck.deckSize)
      if (!this.deck.occupiedPositions.has(randomPosition)) {
        result.push(randomPosition)
        this.deck.occupiedPositions.add(randomPosition)
      }
    }
    return result
  }
  positionCards () {
    for (let key in this.deck.targets)
      this.deck.targets[key].positions = this.findUnoccupiedPositions(this.deck.targets[key].quantity)
    for (let key in this.deck.modifiers)
      this.deck.modifiers[key].positions = this.findUnoccupiedPositions(this.deck.modifiers[key].quantity)
  }
  addCards(targetNames) {
    targetNames.forEach(name => {
      for (let i = 0; i < this.deck.targets[name].quantity; i++)
        if (!this.testCard(this.deck.targets[name].positions[i])) {
          this.deck.targets[name].positions[i] = - 1
          break
        }
    })
  }
  drawCards(count) {
    if (this.deck.cardsDrawn + count <= this.deck.deckSize)
      this.deck.cardsDrawn += count
  }
  destroyCards(count) {
    let success = false
    if (this.deck.deckSize - count > this.deck.cardsDrawn) {
      this.deck.deckSize -= count
      success = true
    }
    return success
  }
  applyModifiers() {
    let repeat = true
    const apply = () => {
      for (let key in this.deck.modifiers) {
        for (let i = 0; i < this.deck.modifiers[key].quantity; i++) {
          if (this.testCard(this.deck.modifiers[key].positions[i])) {
            // apply the effect. This order is used because it is a common pattern in games I've played
            if (!(--this.deck.modifiers[key].timesAllowedPerTurn < 0)) {
              if (this.destroyCards(this.deck.modifiers[key].destroys)) {
                this.addCards(this.deck.modifiers[key].adds)
                this.drawCards(this.deck.modifiers[key].draws)
              }
            }

            // Make sure this modifier cannot be applied again
            this.deck.modifiers[key].positions[i] = this.deck.deckSize + 1

            // apply must be run again incase another modifier now needs to be applied
            return
          }
        }
      }
      repeat = false
    }
    while (repeat)    
      apply()
  }
  testCard(position) {
    return position < this.deck.cardsDrawn
  }
  testHand() {
    let result = []
    for (let key in this.deck.targets) {
      let localResult = false
      for (let i = 0; i < this.deck.targets[key].quantity; i++) {
        if (this.testCard(this.deck.targets[key].positions[i])) {
          localResult = true
          break
        }
      }
      result.push(localResult)
    }
    return !result.includes(false)
  }
  simulate() {
    for (let i = 0; i < this.simulationCount; i++) {
      this.initialise()
      this.drawCards(this.deck.cardsToDraw)
      this.applyModifiers()
      this.debugPrint()
      this.results.push(this.testHand())
    }
    return this
  }
  result() {
    const successes = this.results.reduce((acc, cur) => acc + cur)
    const successProbability = successes / this.simulationCount
    return successProbability
  }
  print() {
    const successes = this.results.reduce((acc, cur) => acc + cur)
    const successProbability = successes / this.simulationCount
    console.log(`Probability of getting this combination: ${100 * successProbability}%`)
    if (successProbability < 0.25)
      console.log(`Your deck's bad`)
  }
  debugPrint() {
    if (this.debug) {
      console.log('-----------------------------------------')
      console.dir(this.deck.targets)
      console.dir(this.deck.modifiers)
      console.dir(this.deck.cardsDrawn)
    }
  }
}

module.exports = {
  Deck
}
