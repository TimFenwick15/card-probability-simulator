'use strict'
const makeDeckObject = () => {
  const deckSize = Number(document.getElementById('deckSize').value) || 0
  const cardsToDraw = Number(document.getElementById('cardsToDraw').value) || 0
  let target = []
  target[0] = Number(document.getElementById('target1').value) || 0
  target[1] = Number(document.getElementById('target2').value) || 0
  target[2] = Number(document.getElementById('target3').value) || 0
  target = target.filter(x => x !== 0)
  const upstart = Number(document.getElementById('upstart').value) || 0
  const desires = Number(document.getElementById('desires').value) || 0
  const greed = Number(document.getElementById('greed').value) || 0
  const deckObject = {
    debug: false,
    deckSize: deckSize,
    cardsToDraw: cardsToDraw,
    targets: {
      /*Target1: {
        quantity: target1
      },
      Target2: {
        quantity: target2
      }*/
    },
    modifiers : {
      Upstart: {
        quantity: upstart,
        adds: [],
        draws: 1,
        destroys: 0,
        timesAllowedPerTurn: 3
      },
      Desires: {
        quantity: desires,
        adds: [],
        draws: 2,
        destroys: 10,
        timesAllowedPerTurn: 1
      },
      Greed: {
        quantity: greed,
        adds: [],
        draws: 2,
        destroys: 0,
        timesAllowedPerTurn: 3
      }
    }
  }
  for (let i = 0; i < target.length; i++) {
    deckObject.targets[`target${i}`] = {}
    deckObject.targets[`target${i}`].quantity = target[i]
  }

  return deckObject
}
const render = result => {
  document.getElementById('result').innerHTML = `${Number(result) * 100}%`
}
const run = () => {
  fetch('/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(makeDeckObject())
  })
    .then(res => res.text())
    .then(res => render(res))
}
