import React from 'react'
import PokemanLink from './PokemanLink'

export default class BackButton extends React.Component {

    constructor() {
        super(...arguments)
    }

    render() {
        return (
            <PokemanLink back>
                <button className="back-button"/>
            </PokemanLink>
        )
    }
}