import Constants from './Constants'

export default class Utils {
  static generateGenButtons (selected, onClickCallback, maxGen = Constants.MAX_GEN) {
    let genButtons = []

    for (let i = 1; i <= maxGen; i++) {
      let clazz = (i === 1) ? 'gen-button-left' : (i === maxGen) ? 'gen-button-right' : 'gen-button-center'
      if (Utils.arrayfy(selected).indexOf(i) !== -1) {
        clazz += ' selected'
      }

      genButtons.push(
        <label key={i}
          className={'gen-button ' + clazz}
          onClick={() => { onClickCallback(i) }}>
          {i}
        </label>)
    }

    return genButtons
  }

  static findWord (str, word) {
    return str.split(' ').some(w => w === word)
  }

  static toggle (array, value, isMono) {
    let index = array.indexOf(value); let copy
    if (!isMono) {
      copy = array.slice()
      if (index !== -1) {
        copy.splice(index, 1)
      } else {
        copy.push(value)
      }
    } else if (index !== -1) {
      copy = []
    } else {
      copy = [ value ]
    }

    return copy
  }

  static arrayfy (a) {
    return a.length === undefined ? [a] : a
  }

  static normalizeText (text) {
    const subs = [
      [ 'é', 'e' ],
      [ 'è', 'e' ],
      [ 'ê', 'e' ],
      [ 'ë', 'e' ],
      [ 'à', 'a' ],
      [ 'â', 'a' ],
      [ 'ä', 'a' ]
    ]

    let string = text = text.trim().toLowerCase()
    for (let sub of subs) {
      string = Utils.replaceAll(string, sub[0], sub[1])
    }

    return string
  }

  static replaceAll (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
  }

  static round (num, decimals) {
    var n = Math.pow(10, decimals)
    return Math.round((n * num).toFixed(decimals)) / n
  }

  static match (str, rule) {
    let regex = new RegExp('^' + rule.split('*').join('.*') + '$')
    return regex.test(str) || str.indexOf(rule) !== -1
  }

  static isMobileDevice () {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
  }

  static isChildOf (/* child node */c, /* parent node */p) { // returns boolean
    while ((c = c.parentNode) && c !== p);
    return !!c
  }
}
