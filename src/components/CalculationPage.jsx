import React from 'react'
import PokemanLink from './PokemanLink'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import SmallPokemon from './SmallPokemon'
import BackButton from './BackButton'
import PokemanPage from './PokemanPage'

import './css/calc.css'

export default class CalculationPage extends PokemanPage {
    
    constructor() {
        super(null, arguments)
        this.parseQueryString(this.props.location.search)
        
        let pokemon = this.getPokemon()
        if (pokemon) {
            let name = PokedexHelper.loc(pokemon)
            this.setPageCaption('Meilleurs attaquants vs ' + name)
        }
    }
    
    componentWillReceiveProps(newProps) {
        this.parseQueryString(newProps.location.search)
    }

    parseQueryString(queryString) {
        let params = new URLSearchParams(queryString)
        this.showLegendary = params.has('leg') ? params.get('leg') === 'true': true
    }

    buildQueryString() {
        let args = [ 'leg=' + !this.showLegendary ]
        return '?' + args.join('&')
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

        // Sort by rating
        //
        // results.sort((a, b) => {
        //     let ma = a.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)
        //     let mb = b.attacks.reduce((max, attack) => Math.max(max, attack.percent), 0)

        //     return (ma === mb) ? b.pokemon.cpmax - a.pokemon.cpmax : mb - ma
        // })

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

        let ratings = [0, 200, 300, 400, Infinity], stars = 1
        for (let i = 0; i < ratings.length; i++) {
            if (percent <= ratings[i]) {
                stars = i + 1;
                break;
            }
        }
        
        let classes = 'rating calc-rating rating-' + stars
        return (
            <div className={ classes }/>
        )
    }

    
    generateBestAttackers(allResults) {

        return allResults
            .filter(entry => this.showLegendary || !PokedexHelper.isLegendary(entry.pokemon.id))
            .slice(0, MAX_RESULT)
            .map((entry, index) => {
                let pokemon = entry.pokemon
                return (
                    <div className="calc-pokemon-container" key={ pokemon.id }>
                            <div className="calc-pokemon-rank">{ '#' + (index + 1) }</div>
                            <PokemanLink to={{ pathname: '/pokemon/' + pokemon.id, search: '?back=true' }}>
                                <div className="calc-pokemon-img">
                                    <SmallPokemon id={ pokemon.id }/>
                                </div>
                            </PokemanLink>
                            <div className="calc-pokemon-attacks">
                                { this.generateAttacks(entry) }
                            </div>
                        </div>
                )
            })
    }


    generateMeteoButtons() {
        let buttons = []
        for (let i =0, keys = Object.keys(Constants.METEO); i < keys.length; i++) {
            buttons.push(<div className={ "calc-meteo-button meteo-button-" + keys[i] }/>)
        }
        return null
    }


    render() { 

        let pokemon = this.getPokemon()
        if (!pokemon) {
            return this.generatePokemonFail()
        }

        let results = this.calculate(pokemon.id)
        let rows = this.generateBestAttackers(results)

        return (
            <div className="calc-container">
                <div className="navbar">
                    <div className="right-panel">
                        <PokemanLink to={{ pathname: this.props.location.pathname, search: this.buildQueryString() }}>
                            <div className={ 'gen-button gen-button-right gen-button-left' + (this.showLegendary ? ' selected': '') }>LEG</div>
                        </PokemanLink>
                    </div>
                    <div className="left-panel">
                        <BackButton history={ this.props.history }/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                    </div>
                </div>
                <div className="calc-options-container">
                    { this.generateMeteoButtons() }
                </div>

                <div className="calc-results" key={ this.pokemonId }>
                    { rows }
                </div>

                { super.render() }
            </div>
        )
    }
}

const MAX_RESULT = 15
    
    