import React from 'react'
import { Redirect } from 'react-router-dom'

import PokedexHelper from '../data/PokedexHelper'
import PokemanPage from './PokemanPage'
import BackButton from './BackButton'
import SmallPokemon from './SmallPokemon'

import './css/formspage.css'

export default class FormsPage extends PokemanPage {
   
    constructor() {
        super('Formes', arguments)

        this.state = {}
    }

    render() { 

        if (this.state.redirect) {
            return <Redirect push to={ this.state.to }/>
        }

        return <div className="page">
            <div className="navbar">
                <div className="left-panel">
                    <BackButton/>
                    <sup className='title-text'>{ this.getPageCaption() }</sup>
                </div>
            </div>
            <div className="forms-container">
                { this.generateForms() }
            </div>

            { super.render() }
        </div>
    }

    generateForms() {
        const forms = PokedexHelper.getForms()
        return Object.keys(forms).map(pokemonId => {
            return (
                <div className="forms-pokemon-parent">
                    <SmallPokemon id={ pokemonId } onClick={ id => this.onClick(id) }/>
                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    <div className="form-pokemon-forms">
                        { forms[pokemonId].map(pokemon => <SmallPokemon id={ pokemon.id } hideName={ true } onClick={ id => this.onClick(id) }/>)}
                    </div>
                </div>
            )
        })
    }

    onClick(id) {
        this.setState({ redirect: true, to: '/pokemon/' + id })
    }
}
