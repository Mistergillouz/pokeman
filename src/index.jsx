import React from 'react'
import App from 'components/App'
import { render } from 'react-dom'

import '../assets/styles/styles.css'

render(<App/>, document.getElementById('app-root'))

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}
