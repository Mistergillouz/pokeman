
import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import PokemanLink from './PokemanLink'
import NotFound from './NotFound'
import Utils from 'data/Utils'
import './css/pokeman.css'

export default class PokemanPage extends React.Component {

    constructor(caption, args) {
        super(...args)
        this.caption = caption
        this.state = {}
    }

    render() {

        if (!Utils.isMobileDevice()) {
            return null
        }

        let text = (this.caption || 'Pokeman') + ' - ' + encodeURIComponent(window.location.href)
        return (
            <a href={ 'whatsapp://send?text=' + text }>
                <div className='pokeman-button'/>
            </a>
        )
    }

    getPageCaption() { return this.caption || '' }
    setPageCaption(caption) { this.caption = caption }

    getPokemon() {
        if (this.props && this.props.match && this.props.match.params) {
            return PokedexHelper.getPokemon(this.props.match.params.id)
        }

        return null
    }

    generatePokemonFail() {
        return (
            <PokemanLink to='/'>
                <NotFound text="Impossible de recupérer les informations du pokemon"/>
            </PokemanLink>
        )
    }
}