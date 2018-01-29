import React from 'react'
import PokemanLink from './PokemanLink'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import BackButton from './BackButton'
import NotFound from './NotFound'
import PokemanPage from './PokemanPage'
import FontIcon from './FontIcon'
import Species from './Species'

import './css/resists.css'

export default class ResistPage extends PokemanPage {
    
    constructor() {
        super(null, arguments)

        let error = true, mode = ResistPage.MODE.ShowPokemon
        
        let pokemon = this.getPokemon(), species = []
        if (pokemon) {

            let name = PokedexHelper.loc(pokemon)
            this.setPageCaption('Forces/résistances de ' + name)
            species = pokemon.species.slice()
            error = false

        } else {
            let ids = this.props.match.params.ids
            if (ids) {

                let parts = ids.split(','), speciesText = []
                for (let speciesId of parts) {
                    let id = Number(speciesId), speciesInfo = PokedexHelper.getSpecies(id)
                    if (speciesInfo && species.indexOf(id) === -1) {
                        error = false
                        speciesText.push(PokedexHelper.loc(speciesInfo))
                        species.push(id)
                        if (species.length === 2) {
                            break
                        }
                    }
                }

                if (!error) {
                    this.setPageCaption('Forces/résistances pour ' + speciesText.join(' / '))
                    mode = ResistPage.MODE.ShowResistSelect
                }
            }
        }

        this.state = {
            error: error,
            species: species,
            tabId: ResistPage.TABS[0].id,
            mode: mode
        }
    }
    
    componentDidMount() {
        this.updateVisibility()
    }

    componentDidUpdate() {
        this.updateVisibility()
    }

    updateVisibility() {
        if (!this.state.error) {
            for (let tab of ResistPage.TABS) {
                let element = document.getElementById(tab.target)
                element.style.display = (this.state.tabId === tab.id) ? 'block' : 'none'
            }
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
        let classes = 'resist-tab-links'
        if (this.state.tabId === tab.id) {
            classes += ' active'
        }
        return (
            <div className={ classes }  onClick={ () => this.show(tab.id) }>
                <FontIcon icon={ tab.icon }/>
                { tab.text }
            </div>
        )
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

    generateNoBonuses(data) {
        if (!data.length) {
            return null
        }

        return (
            <div>
                <i className="fa fa-info-circle fa-pokeman-normal resist-info-icon" aria-hidden="true"></i>
                <span className='resist-table-section'>Sans bonus ni malus</span>
                <div className="resist-nobonus-table">
                    { data.map(id => <Species id={ id }/>) }
                </div>
            </div>
        )
    }

    buildRows(data, isAttack) {
        let strength = [], weak = [], noBonuses = []
        Object.keys(data).forEach(id => {
            let percent = data[id]
            if (percent > 100) {
                strength.push(id)
            } else if (percent < 100) {
                weak.push(id)
            } else {
                noBonuses.push(id)
            }
        })
        return (
            <div>
                <div className='resist-tables'>
                    { this.generate(data, strength, isAttack, true) }
                    { this.generate(data, weak, isAttack, false) }
                </div>
                { this.generateNoBonuses(noBonuses) }
            </div>
        )
    }

    generatePage(species) {

        let [strengths, weaknesses] = PokedexHelper.getSpeciesStrengthWeakness(species)
        let atkRows = this.buildRows(strengths, true)
        let resRows = this.buildRows(weaknesses, false)

        return (
            <div className="resist-container" key={ this.state.species.join('-') }>
                <div className="resist-tab">
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

    generateSelects() {
        
          
        return (
            <div>
            </div>
        )
    }

    renderSelectItem(item) {
        let styles = {
            backgroundColor: item.value
        }

        return item.name
    }

    render() { 

        if (this.state.error) {
            return this.generatePokemonFail()
        }

        return (
            <div>
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                        { this.state.mode === ResistPage.MODE.ShowResistSelect ? this.generateSelects() : null }
                    </div>
                </div>
                { this.generatePage(this.state.species) }
                { super.render() }
            </div>
        )
    }
}

ResistPage.TABS = [
    { id: 'atk', text: 'Attaques', target: 'strength-table', icon: 'fa-bolt' },
    { id: 'def', text: 'Résistances', target: 'defense-table', icon: 'fa-shield' }
]

ResistPage.MODE = {
    ShowResistSelect: 1,
    ShowPokemon: 0
}
    
var colours = [{
    name: "Red",
    value: "#F21B1B"
  }, {
    name: "Blue",
    value: "#1B66F2"
  }, {
    name: "Green",
    value: "#07BA16"
  }];