import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import CombatPanel from 'components/CombatPanel'
import SmallPokemon from 'components/SmallPokemon'

class ZoomPage extends React.Component {
   constructor() {
        super(...arguments)
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.args) {
            this.setState({ highlightedId: nextProps.args.id })
        }
    }
    
    onPokemonClicked(pokemonId) {
        this.setState({ highlightedId: pokemonId })
    }

    selectedId() {
        return Number(this.state.highlightedId)
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
        let row = [0 ,0, 0]
        grid.push(row)
        return row
    }

    generateEvolvesRows(evolutions) {    
        
        let grid = [], trs = []
        this.createEvolvesGrid(evolutions, grid, 0)
        grid.forEach(row => {

            let tds = []
            row.forEach(id => {
                let pokemonId = Number(id)
                if (pokemonId) {
                    let name = PokedexHelper.getPokemonName(pokemonId)
                    tds.push(<td><SmallPokemon key={ pokemonId } 
                        id={ pokemonId } 
                        name={ name }
                        selected = { pokemonId === this.selectedId() }
                        onClick={ id => this.onPokemonClicked(id) }/></td>)
                } else {
                    tds.push(<td></td>)
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

        let evolutions = PokedexHelper.getEvolvesList(this.props.args.id), trs = null
        if (evolutions[0].children.length) {
            trs = this.generateEvolvesRows(evolutions);
        }
        let label = PokedexHelper.getPokemonName(this.props.args.id)
        return (

            <div className="page">
                <div className="navbar">
                    <div className="left-panel">
                        <button className="back-button" onClick= {() => this.onBack() }></button>
                        <sup className='title-text'>{ label }</sup>
                    </div>
                </div>
                <div className="pokemon-zoom">
                    <div className="zoom-container">
                        <table><tbody>
                        {trs}
                        </tbody></table>
                    </div>
                    <CombatPanel id={ this.selectedId() } onClose={() => this.onBack() }/>
                </div>
		    </div>
        )
    }
}


export default ZoomPage; 