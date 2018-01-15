import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import PokemanPage from './PokemanPage';
import SmallPokemon from './SmallPokemon';
import '../../assets/styles/calc.css'

export default class CalculationPage extends PokemanPage {
    
    calculate(pokemonId) {

        let pokemon = PokedexHelper.getPokemon(pokemonId)
        let [strengths, weaknesses] = PokedexHelper.getStrengthWeakness(pokemonId)

        let results = []
        PokedexHelper.enumPokemons(currentPokemon => {

            if (currentPokemon.gen > Constants.CURRENT_GEN || currentPokemon.cpmax < 2000 || currentPokemon.evolves) {
                return
            }
            
            let attacks = PokedexHelper.getAttacks(currentPokemon.id).charged, entry = null
            for (let attack of attacks) {
                let percent = weaknesses[attack.type]
                if (percent <= 100) {
                    continue
                }

                // STAB
                if (currentPokemon.species.indexOf(attack.type) !== -1) {
                    percent *= 1.5
                }

                if (!entry) {
                    entry = { pokemon: currentPokemon, attacks: [], against: [] }
                }
                entry.attacks.push({ attack, percent })
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
        results.sort((a, b) => {
            let ma = a.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)
            let mb = b.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)

            ma = 1 + ma / 1000
            mb = 1 + mb / 1000

            return (b.pokemon.cpmax * mb) - (a.pokemon.cpmax * ma)
        })

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
    
    