import React from 'react'
import App from './components/App'
import { render } from 'react-dom'
import PokedexHelper from './data/PokedexHelper'

import '../assets/styles/styles.css'
import NotFound from './components/NotFound';

fetch(window.location.origin + '/config.json')    
    .then(response => response.json())
    .then(data => {
        PokedexHelper.setConfig(data)
        render(<App/>, document.getElementById('app-root'))
    })
    .catch(() => render (<NotFound text='La liste des shinies na pas pu être recuperée'/>, document.getElementById('app-root')))
  


window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}
