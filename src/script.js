const deck = {
  debug: false,
  deckSize: 40,
  cardsToDraw: 5,
  targets: {
    ABC: {
      quantity: 9
    },
    Hanger: {
      quantity: 6
    }
  },
  modifiers : {
    /*Upstart: {
      quantity: 1,
      adds: [],
      draws: 1,
      destroys: 0,
      timesAllowedPerTurn: 1
    },*/
    Desires: {
      quantity: 3,
      adds: [],
      draws: 2,
      destroys: 10,
      timesAllowedPerTurn: 1
    },
    /*Greed: {
      quantity: 3,
      adds: [],
      draws: 2,
      destroys: 0,
      timesAllowedPerTurn: 3
    }*/
  }
}

const render = result => {
  document.getElementById('result').innerHTML = result
}
const run = () => {
  fetch('/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deck)
  })
    .then(res => res.text())
    .then(res => render(res))
}

// consider having a property that determines failure rate, or condition of hand and sometimes allow this to happen
