'use strict'
const loremIpsum = require('lorem-ipsum')

module.exports = (unit) => {
  if (!unit) {
    unit = 'sentence.0'
  }
  return loremIpsum({
    count: 1,
    units: unit,
    sentenceUpperBound: 7,
    format: 'plain'
  })
}
