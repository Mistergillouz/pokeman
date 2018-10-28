import React from 'react'
import { Link, Redirect } from 'react-router-dom'

import EvolutionPanel from './EvolutionPanel'
import NotFound from './NotFound'
import BackButton from './BackButton'
import PokemanPage from './PokemanPage'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import Utils from '../data/Utils'

import './css/evol.css'

class EvolutionPage extends PokemanPage {
   
    constructor() {
        super('Evolutions Explorer', arguments)

        const searchParams = new URLSearchParams(this.props.location.search)
        const paramText = searchParams.get('q')
        const fromGens = this._toGen(paramText, true) || [Constants.CURRENT_GEN]
        const toGens = this._toGen(paramText, false) || [Constants.CURRENT_GEN]
        
        Object.assign(this.state, { 
            fromGens,
            toGens
        })
    }

    onGenFromClicked(gen) {
        const args = { fromGens: Utils.toggle(this.state.fromGens, gen, false) }
        this.updatePageLink(args)
    }

    onGenToClicked(gen) {
        const args = { toGens: Utils.toggle(this.state.toGens, gen, false) }
        this.updatePageLink(args)
    }

    updatePageLink(args = {}) {
        const fromGens = args.fromGens || this.state.fromGens
        const toGens = args.toGens || this.state.toGens
        this.setState({
            fromGens,
            toGens
        })

        this.setUrlParam('q', fromGens.sort().join('') + '-' + toGens.sort().join(''))
    }

    onPokemonSelected(pokemonId) {
        this.setState({ redirect: true, to: '/pokemon/' + pokemonId })
    }

    resolve() {
        let evolves = PokedexHelper.getEvolveFromTo(this.state.fromGens, this.state.toGens)
        let showGen = this.state.fromGens.length !== 1 || this.state.toGens.length !== 1 || this.state.toGens[0] !== this.state.fromGens[0]
        let rows = Object.keys(evolves).map(pokemonId => <EvolutionPanel evolves={ evolves[pokemonId] } showGen={ showGen } onClick={ id => this.onPokemonSelected(id) }/>)
        return (
            rows.length ? rows : <NotFound text="Désolé. Pas de resultats correspond aux critéres d'évolutions séléctionnés"/>
        )
    }
       
    render() { 

        if (this.state.redirect) {
            delete this.state.redirect
            return <Redirect to={ this.state.to }/>
        }

        let genFromButtons = Utils.generateGenButtons(this.state.fromGens, this.onGenFromClicked.bind(this))
        let genToButtons = Utils.generateGenButtons(this.state.toGens, this.onGenToClicked.bind(this))
        let rows = this.resolve()

        return (
            <div className="evol-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                    </div>
                    <sup className='centered-text'>{ this.getPageCaption() }</sup>
                </div>

                <div className="evol-filters">
                    <span>Génération(s) de depart</span>
                    <div className="evol-filters-gens">
                        { genFromButtons }
                    </div>

                    <span>Génération(s) d'arrivée</span>
                    <div className="evol-filters-gens">
                        { genToButtons }
                    </div>
                </div>

                <div className="evol-results">
                    { rows }
                </div>

                { super.render() }

            </div>
        )
    }

    _toGen (inputText, isFrom) {
        if (!inputText) {
            return null
        }

        const index = inputText.indexOf('-')
        if (index < 0) {
            return null
        }

        const text = isFrom ? inputText.substring(0, index) : inputText.substring(index + 1)
        const gens = []
        for (let i = 0; i < text.length; i++) {
            const gen = Number(text.charAt(i))
            if (isNaN(gen) || gen > Constants.MAX_GEN) {
                return null
            }
            gens.push(gen)
        }

        return gens.sort()
    }
}

export default EvolutionPage