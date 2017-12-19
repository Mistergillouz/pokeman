import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import Pokemon from 'components/Pokemon'
import CombatPanel from 'components/CombatPanel'

class ZoomPage extends React.Component {
   constructor() {
        super(...arguments)
    }

    eventHandler(args) {
        args.noPageStack = true
        this.props.eventHandler(args)
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
        
        let grid = [], trs = []
        this.createEvolvesGrid(evolutions, grid, 0)
        grid.forEach(row => {

            let tds = []
            row.forEach((id, level) => {
                let pokemonId = Number(id)
                if (pokemonId) {
                    tds.push(<Pokemon key={ pokemonId } 
                        id={ pokemonId } 
                        inactive={ pokemonId !== Number(this.props.args.id) } 
                        className={ 'zoom-indent' + level } 
                        eventHandler={ (args) => this.eventHandler(args) }/>)
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

        let evolves = [];
        let evolutions = PokedexHelper.getEvolvesList(this.props.args.id);
        let trs = this.generateEvolvesRows(evolutions);

        return (

            <div className="page">
                <div className="navbar">
                    <button className="left-panel back-button" onClick= {() => this.onBack() }></button>
                    <label>Evolutions</label>
                </div>
                <div className="pokemon-zoom">
                    <div className="zoom-container">
                        <table><tbody>
                        {trs}
                        </tbody></table>
                    </div>
                    <CombatPanel id={ this.props.args.id }/>
    		    </div>
		    </div>
        )
    }
}

export default ZoomPage; 