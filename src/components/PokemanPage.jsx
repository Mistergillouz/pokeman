
import React from 'react'
import Constants from 'data/Constants'

export default class PokemanPage extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {}
    }

    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    onPokemonSelected(id) {
        this.props.eventHandler({
            eventType: Constants.EVENT.PokemonClicked,
            id: id
        })
    }
}