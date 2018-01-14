import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SmallPokemon from './SmallPokemon';
import '../../assets/styles/calc.css'

export default class CalculationPage extends React.Component {
    
    constructor() {
        super(...arguments)

        this.state = {}
    }
    
    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    calculate(pokemonId) {

        let pokemon = PokedexHelper.getPokemon(pokemonId)
        let [strengths, weaknesses] = PokedexHelper.getStrengthWeakness(pokemonId)

        let results = []
        PokedexHelper.enumPokemons(currentPokemon => {

            if (currentPokemon.gen > 3 || currentPokemon.cpmax < 2000 || currentPokemon.evolves) {
                return
            }
            
            let [strs, weaks] = PokedexHelper.getStrengthWeakness(currentPokemon.id), entry = null
            for (let i = 0; i < currentPokemon.species.length; i++) {
                if (weaknesses[currentPokemon.species[i]] > 100) {
                    let attacks = PokedexHelper.getAttacks(currentPokemon.id).charged;
                    attacks.forEach(attack => {
                        let percent = weaknesses[attack.type]
                        if (percent > 100) {
                            if (currentPokemon.species.indexOf(attack.type) !== -1) {
                                percent *= 1.25
                            }
                            if (!entry) {
                                entry = { pokemon: currentPokemon, attacks: [], against: [] }
                            }
                            entry.attacks.push({ attack, percent })
                        }
                    })

                    break
                }
            }

            if (entry) {
                results.push(entry)
            }
        })

        return results
    }

    generateAttack(attackEntry) {
        let species = PokedexHelper.getSpecies(attackEntry.attack.type)
        let key = PokedexHelper.getSpeciesKey(species)
        return (
            <div className="calc-pokemon-attack">
                <div className={ 'icon-type-' + key }/>
                <span>{ PokedexHelper.loc(attackEntry.attack) }</span>
            </div>
        )
    }

    generateBestAttackers(results) {
        results.sort((a, b) => b.pokemon.cpmax - a.pokemon.cpmax)
        results.length = Math.min(MAX_RESULT, results.length)
        return results.map((entry, index) => {
            entry.attacks.sort((a, b) => (b.attack.dmg * b.percent) - (a.attack.dmg * a.percent))
            let pokemon = entry.pokemon
            return (
                <div className="calc-pokemon-container" onClick={ () => this.onPokemonSelected(pokemon.id) }>
                    <div className="calc-pokemon-rank">{ '#' + (index + 1) }</div>
                    <div className="calc-pokemon-img">
                        <SmallPokemon id={ pokemon.id }/>
                    </div>
                    <div className="calc-pokemon-attacks">
                        { entry.attacks.map(entry => this.generateAttack(entry)) }
                    </div>
                </div>
            )
        })
    }

    onPokemonSelected(id) {
        this.props.eventHandler({
            eventType: Constants.EVENT.PokemonClicked,
            id: id
        })
    }

    render() { 

        if (!this.props.visible) {
            return null
        }

        let results = this.calculate(Number(this.props.id))
        let rows = this.generateBestAttackers(results)
        let name = PokedexHelper.loc(PokedexHelper.getPokemon(this.props.id))

        return (
            <div className="calc-container">
                <div className="navbar">
                    <div className="left-panel">
                        <button className="back-button" onClick= {() => this.onBack() }></button>
                        <sup className='title-text'>{ 'Meilleurs attaquants vs ' + name }</sup>
                    </div>
                </div>

                <div className="calc-results" key={ this.props.id }>
                    { rows }
                </div>
            </div>
        )
    }
}

const MAX_RESULT = 15
    
    