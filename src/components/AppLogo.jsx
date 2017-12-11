import React from 'react'
import './App.css'

class AppLogo extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    render() { 
        return (
            <div className='app_logo'>
                <img src='assets/images/logo.png'/>
            </div>
        )
    }
}

export default AppLogo