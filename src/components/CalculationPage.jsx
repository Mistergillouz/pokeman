import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import PokemanPage from './PokemanPage';
import SmallPokemon from './SmallPokemon';
import '../../assets/styles/calc.css'

export default class CalculationPage extends PokemanPage {
    
    constructor() {
        super(...arguments)

        Object.assign(this.state, {
            showLegendary: true
        })

    }

    calculate(pokemonId) {

        let pokemon = PokedexHelper.getPokemon(pokemonId)
        let [strengths, weaknesses] = PokedexHelper.getStrengthWeakness(pokemonId)

        let results = []
        PokedexHelper.enumPokemons(currentPokemon => {

            if (currentPokemon.gen > Constants.CURRENT_GEN || currentPokemon.cpmax < 2000 || currentPokemon.evolves) {
                return
            }
            
            let attacks = PokedexHelper.getAttacks(currentPokemon.id), entry = null
            for (let chargedAttack of attacks.charged) {
                let percent = weaknesses[chargedAttack.type]
                if (percent > 100) {
                    // STAB
                    if (currentPokemon.species.indexOf(chargedAttack.type) !== -1) {
                        percent *= 1.5
                    }
    
                    if (!entry) {
                        entry = { pokemon: currentPokemon, attacks: [], against: [] }
                    }
                    entry.attacks.push({ attack: chargedAttack, percent })
                }
            }

            if (entry) {

                let bestAttack = { dps: 0, attack: null }
                for (let attack of attacks.fast) {
                    let dps = attack.dps * weaknesses[attack.type] / 100
                    if (dps > bestAttack.dps) {
                        bestAttack = { attack, dps }
                    }
                }

                if (bestAttack.dps) {
                    entry.fastAttack = bestAttack.attack
                    results.push(entry)
                }
            }
        })

        results.sort((a, b) => {
            let ma = a.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)
            let mb = b.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)

            ma = 1 + ma / 1000
            mb = 1 + mb / 1000

            return (b.pokemon.cpmax * mb) - (a.pokemon.cpmax * ma)
        })

        return results
    }

    generateAttacks(entry) {

        entry.attacks.sort((a, b) => (b.attack.dmg * b.percent) - (a.attack.dmg * a.percent))

        let attacks = []
        attacks.push(this.generateAttack(entry.fastAttack, 0, true))
        for (let attackEntry of entry.attacks) {
            attacks.push(this.generateAttack(attackEntry.attack, attackEntry.percent))
        }

        return attacks
    }

    generateAttack(attack, percent, isFastAttack) {
        let species = PokedexHelper.getSpecies(attack.type)
        let key = PokedexHelper.getSpeciesKey(species)
        let classes = "calc-pokemon-attack" + (isFastAttack ? ' calc-fast-attack' : '')
        return (
            <div className={ classes }>
                <div className={ 'calc-pokemon-attack-type-icon icon-type-' + key }/>
                <div>
                    <span>{ PokedexHelper.loc(attack) }</span>
                    { this.generateRating(percent, isFastAttack) }
                </div>
            </div>
        )
    }

    generateRating(percent, isFastAttack) {

        if (isFastAttack) {
            return null
        }

        let stars = Math.round((percent + 50) / 100)
        stars = Math.max(1, Math.min(5, stars))
        let classes = 'rating calc-rating rating-' + stars
        return (
            <div className={ classes }/>
        )
    }

    
    generateBestAttackers(allResults) {

        return allResults
            .filter(entry => this.state.showLegendary || !PokedexHelper.isLegendary(entry.pokemon.id))
            .slice(0, MAX_RESULT)
            .map((entry, index) => {
                let pokemon = entry.pokemon
                return (
                    <div className="calc-pokemon-container" key={ pokemon.id } onClick={ () => this.onPokemonSelected(pokemon.id) }>
                        <div className="calc-pokemon-rank">{ '#' + (index + 1) }</div>
                        <div className="calc-pokemon-img">
                            <SmallPokemon id={ pokemon.id }/>
                        </div>
                        <div className="calc-pokemon-attacks">
                            { this.generateAttacks(entry) }
                        </div>
                    </div>
                )
            })
    }


    onToggleLeg() {
        this.setState({ showLegendary: !this.state.showLegendary })
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
                    <div className="right-panel">
                        <div onClick={ () => this.onToggleLeg() } className={ 'gen-button gen-button-right gen-button-left' + (this.state.showLegendary ? ' selected': '') }>LEG</div>
                    </div>
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
    
    