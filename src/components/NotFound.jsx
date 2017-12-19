import React from 'react'

class NotFound extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    render() { 

        return (
            <div className="not-found-container">
                <img className="not-found-image" src="assets/images/notfound.png"/>
                <span className="not-found-text">{ this.props.text }</span>
            </div>
        )
    }
}

export default NotFound
