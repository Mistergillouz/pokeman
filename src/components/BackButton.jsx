import React from 'react'
import PokemanLink from './PokemanLink'
import { withRouter } from 'react-router-dom'

class BackButton extends React.Component {

    constructor() {
        super(...arguments)
    }

    render() {
        if (this.props.history.length <= 2) {
            return null;
        }

        let className = this.props.className || 'back-button'
        return (
            <PokemanLink back>
                <div className={ className }/>
            </PokemanLink>
        )
    }
}

export default withRouter(BackButton)