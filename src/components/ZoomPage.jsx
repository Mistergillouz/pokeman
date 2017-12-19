import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import Pokemon from 'components/Pokemon'
import CombatPanel from 'components/CombatPanel'

class ZoomPage extends React.Component {
   constructor() {
        super(...arguments)
        this.state = {}
    }

    onPokemonClicked(pokemonId) {
        this.setState({ highlightedId: pokemonId })
    }

    selectedId() {
        return this.state.highlightedId || this.props.args.id
    }

    createEvolvesGrid(evolutions, grid, level) {

        let gridRow = (level === 0) ? this._addGridRow(grid) : grid[grid.length - 1]
        evolutions.forEach((evolution, index) => {
            if (index > 0) {
                gridRow = this._addGridRow(grid)
            }
            gridRow[level] = evolution.id
            this.createEvolvesGrid(evolution.children, grid, level + 1)
        })
    }

    _addGridRow(grid) {
        let row = []
        grid.push(row)
        return row
    }

    generateEvolvesRows(evolutions) {    
        
        let grid = [], trs = [], highlightedId = this.selectedId()
        this.createEvolvesGrid(evolutions, grid, 0)
        grid.forEach(row => {

            let tds = []
            row.forEach((id, level) => {
                let pokemonId = Number(id)
                if (pokemonId) {
                    tds.push(<Pokemon key={ pokemonId } 
                        id={ pokemonId } 
                        inactive={ pokemonId !== highlightedId } 
                        className={ 'zoom-indent' + level } 
                        eventHandler={ (args) => this.onPokemonClicked(args.id) }/>)
                }
            })

            trs.push(<tr>{ tds }</tr>)
        })

        return trs
    }

    onBack() {

        this.props.eventHandler({
            eventType: Constants.EVENT.Back
        });
    }
    
    render() { 

        if (!this.props.visible) {
            return null;
        }

        let evolutions = PokedexHelper.getEvolvesList(this.props.args.id);
        let trs = this.generateEvolvesRows(evolutions);
        let label = 'Evolutions: ' + PokedexHelper.getPokemonName(this.props.args.id)
        return (

            <div className="page">
                <div className="navbar">
                    <button className="left-panel back-button" onClick= {() => this.onBack() }></button>
                    <label>{ label }</label>
                </div>
                <div className="pokemon-zoom">
                    <div className="zoom-container">
                        <table><tbody>
                        {trs}
                        </tbody></table>
                    </div>
                    <CombatPanel id={ this.selectedId() }/>
    		    </div>
		    </div>
        )
    }
}

export default ZoomPage; 