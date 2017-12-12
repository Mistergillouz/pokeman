import React from 'react'
import MainPage from 'components/MainPage'

class App extends React.Component {
   constructor() {
        super(...arguments)
    }

    render() { 
        return (
            <div className='app'>
                <MainPage/>
            </div>
        )
    }
}

export default App; 