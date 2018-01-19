import React from 'react'
import { Link, Redirect } from 'react-router-dom'

import EvolutionPanel from 'components/EvolutionPanel'
import NotFound from 'components/NotFound'
import BackButton from 'components/BackButton'
import PokemanPage from 'components/PokemanPage'

import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import Utils from 'data/Utils'

import './css/evol.css'

class EvolutionPage extends PokemanPage {
   
    constructor() {
        super(...arguments)

        this.state = {
            fromGens: [Constants.CURRENT_GEN],
            toGens: [Constants.CURRENT_GEN]
        }
    }

    onGenFromClicked(gen) {
        let array = Utils.toggle(this.state.fromGens, gen, false)
        this.setState({ fromGens: array })
    }

    onGenToClicked(gen) {
        let array = Utils.toggle(this.state.toGens, gen, false)
        this.setState({ toGens: array })
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
            return <Redirect push to={ this.state.to }/>
        }

        let genFromButtons = Utils.generateGenButtons(this.state.fromGens, this.onGenFromClicked.bind(this))
        let genToButtons = Utils.generateGenButtons(this.state.toGens, this.onGenToClicked.bind(this))
        let rows = this.resolve()

        return (
            <div className="evol-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>Evolutions Explorer</sup>
                    </div>
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
}

export default EvolutionPage