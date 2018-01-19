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

        return (
            <PokemanLink back>
                <button className="back-button"/>
            </PokemanLink>
        )
    }
}

export default withRouter(BackButton)