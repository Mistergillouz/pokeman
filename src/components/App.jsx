import React from 'react'
import './App.css'

import AppLogo from 'components/AppLogo'

class App extends React.Component {
   constructor() {
        super(...arguments)
    }

    render() { 
        return (
            <div className='app'>
                <AppLogo />
            </div>
        )
    }
}

export default App 