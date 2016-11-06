'use strict'
const loremIpsum = require('lorem-ipsum')

module.exports = (unit = 'sentence') => {
  return loremIpsum({
    count: 1,
    units: unit,
    sentenceUpperBound: 7,
    format: 'plain'
  })
}
