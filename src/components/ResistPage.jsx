import React from 'react'
import PokemanLink from './PokemanLink'

import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import BackButton from './BackButton'
import NotFound from './NotFound'
import PokemanPage from './PokemanPage'
import FontIcon from './FontIcon'
import Species from './Species'

import './css/resists.css'

export default class ResistPage extends PokemanPage {
    
    constructor() {
        super(null, arguments)
        this.pokemonId = Number(this.props.match.params.id)

        let pokemon = this.getPokemon()
        if (pokemon) {
            let name = PokedexHelper.loc(pokemon)
            this.setPageCaption('Forces/résistances de ' + name)
        }
        
        this.state = { tabId: ResistPage.TABS[0].id }
    }
    
    componentDidMount() {
        this.updateVisibility()
    }

    componentDidUpdate() {
        this.updateVisibility()
    }

    updateVisibility() {
        for (let tab of ResistPage.TABS) {
            let element = document.getElementById(tab.target)
            element.style.display = (this.state.tabId === tab.id) ? 'block' : 'none'
        }
    }

    show(tabId) {
        this.setState({ tabId: tabId })
    }

    getPercentMessage(percent, isAttack) {

        const attackMsgs = [ 'Trés fort vs', 'Fort vs', 'Dégats sans bonus vs', 'Faible vs', 'Trés faible vs', 'Extrémement faible vs' ]
        const defenseMsgs = [ 'Trés faible vs', 'Faible vs', 'Dégats sans bonus vs', 'Bonnes vs', 'Trés bonnes vs', 'Extrémement bonnes vs' ]

        let msgs = (isAttack) ? attackMsgs : defenseMsgs

        switch (percent) {
            case 400: return msgs[0]
            case 200: return msgs[1]
            case 100: return msgs[2]
            case 50: return msgs[3]
            case 25: return msgs[4]
            case 0: return msgs[5]
            default: return '???'
        }
    }

    generateTabLink(tab) {
        let classes = 'species-tab-links'
        if (this.state.tabId === tab.id) {
            classes += ' active'
        }
        return <div className={ classes }  onClick={ () => this.show(tab.id) }>{ tab.text }</div>
    }

    generate(data, table, isAttack, isStrenght) {

        let rows = []
        table.sort((a, b) => data[b] - data[a])
        let previous = Infinity
        for (let id of table) {
            let percent = data[id]
            if (previous !== percent) {
                let header = this.getPercentMessage(percent, isAttack)
                rows.push(<span className='resist-table-section'>{ header }</span>)
                previous = percent
            }

            rows.push(<Species id={ id }/>)
        }

        return (
            <div className='resist-table'>{ rows }</div>
        )
    }

    buildRows(data, isAttack) {
        let strength = [], weak = []
        Object.keys(data).forEach(id => {
            let percent = data[id]
            if (percent > 100) {
                strength.push(id)
            } else if (percent < 100) {
                weak.push(id)
            }
        })
        return (
            <div className='resist-tables'>
                { this.generate(data, strength, isAttack, true) }
                { this.generate(data, weak, isAttack, false) }
            </div>
        )
    }

    generatePage(pokemon) {
        let id = pokemon.id
        let [strengths, weaknesses] = PokedexHelper.getStrengthWeakness(id)
        let atkRows = this.buildRows(strengths, true)
        let resRows = this.buildRows(weaknesses, false)

        return (
            <div className="species-container" key={ id }>
                <div className="species-tab">
                    { ResistPage.TABS.map(tab => this.generateTabLink(tab)) }
                </div>

                <div className="resist-tables-container">
                    <div id="strength-table">
                        { atkRows }
                    </div>
                    <div id="defense-table">
                        { resRows }
                    </div>
                </div>
            </div>
        )
    }

    render() { 
        let pokemon = this.getPokemon()
        if (!pokemon) {
            return this.generatePokemonFail()
        }

        return (
            <div className="resist-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                    </div>
                </div>
                { this.generatePage(pokemon) }
            </div>
        )
    }
}

ResistPage.TABS = [
    { id: 'atk', text: 'Attaques', target: 'strength-table' },
    { id: 'def', text: 'Résistances', target: 'defense-table' }
]

    
    