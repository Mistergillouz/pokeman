import React from 'react'
import SmallPokemon from './SmallPokemon';
import NotFound from './NotFound';
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import Utils from 'data/Utils'
import '../../assets/styles/evol.css'

class EvolutionPage extends React.Component {
   
    constructor() {
        super(...arguments)

        this.state = {
            fromGens: [1, 2, 3],
            toGens: [4, 5, 6, 7]
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

    generateEvolve(pokemonId, children) {

        let rows = children.map((childId, index) => {
            let html = []
            if (index === 0) {
                html.push(<td><SmallPokemon id={ pokemonId } showGen='true'/></td>)
            } else {
                html.push(<td></td>)
            }

            html.push(<td><img src='../assets/images/rightarrow.png' className='evol-right-arrow'/></td>)
            html.push(<td><SmallPokemon id={ childId } showGen='true'/></td>)
            return (
                <tr>{ html }</tr>
            ) 
        })

        return (
            <table key={ pokemonId }><tbody>{ rows }</tbody></table>
        )
    }

    resolve() {
        let evolves = PokedexHelper.getEvolveFromTo(this.state.fromGens, this.state.toGens)
        let rows = Object.keys(evolves).map(pokemonId => this.generateEvolve(pokemonId, evolves[pokemonId]))
        return (
            rows.length ? rows : <NotFound text="Désolé. Pas de resultats correspond aux critéres d'évolutions séléctionnés"/>
        )
    }
       
    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    render() { 

        if (!this.props.visible) {
            return null
        }

        let genFromButtons = Utils.generateGenButtons(this.state.fromGens, this.onGenFromClicked.bind(this))
        let genToButtons = Utils.generateGenButtons(this.state.toGens, this.onGenToClicked.bind(this))
        let rows = this.resolve()

        return (
            <div className="evol-container">
                <div className="navbar">
                    <div className="left-panel">
                        <button className="back-button" onClick= {() => this.onBack() }></button>
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
            </div>
        )
    }
}

export default EvolutionPage