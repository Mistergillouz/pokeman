import React from 'react'

class LocaleFlag extends React.Component {
   constructor() {
        super(...arguments)
    }

    render() { 
        return (
            <img src={ "assets/images/" + this.props.country + ".png" }/>
        )
    }
}

export default LocaleFlag; 