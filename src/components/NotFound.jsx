import React from 'react'
import './css/notfound.css'

class NotFound extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    render() { 

        return (
            <div className="not-found-container">
                <div className="not-found-image"/>
                <span className="not-found-text">{ this.props.text }</span>
            </div>
        )
    }
}

export default NotFound
