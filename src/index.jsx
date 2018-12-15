import React from 'react'
import App from './components/App'
import { render } from 'react-dom'
import PokedexHelper from './data/PokedexHelper'

import '../assets/styles/styles.css'
import NotFound from './components/NotFound'

fetch(window.location.origin + '/config.json?_=' + Date.now())
  .then(response => {
    if (!response.ok) {
      throw Error(response.status + '. Lors de la recuperation du fichier de configuration de Pokeman.')
    }
    return response.json()
  })
  .then(data => {
    PokedexHelper.setConfig(data)
    render(<App />, document.getElementById('app-root'))
  })
  .catch(error => render(<NotFound text={error.toString()} />, document.getElementById('app-root')))

window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}
