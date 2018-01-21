import React from 'react'
import PokemanLink from './PokemanLink'
import FontIcon from './FontIcon'
import { withRouter } from 'react-router-dom'

class BackButton extends React.Component {

    constructor() {
        super(...arguments)
    }

    static get defaultIcon() {
        return 'fa-arrow-circle-left'
    } 

    render() {
        if (this.props.history.length <= 2) {
            return null;
        }

        return (
            <PokemanLink back>
                { this.props.image ? <div className={ this.props.image }/> : <FontIcon x2 icon={ BackButton.defaultIcon }/> }
            </PokemanLink>
        )
    }
}

export default withRouter(BackButton)