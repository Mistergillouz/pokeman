import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import CombatPanel from 'components/CombatPanel'
import SmallPokemon from 'components/SmallPokemon'

export default class EvolutionPanel extends React.Component {
    constructor(...args) {
        super(...args)

        this.state = {
            selectedId: this.props.id
        }
    }

    createEvolvesGrid(evolutions, grid, level) {

        if (evolutions) {
            let gridRow = (level === 0) ? _addGridRow(grid) : grid[grid.length - 1]
            evolutions.forEach((evolution, index) => {
                if (index > 0) {
                    gridRow = _addGridRow(grid)
                }
                gridRow[level] = evolution.id
                this.createEvolvesGrid(evolution.children, grid, level + 1)
            })
        }
    }

    generateEvolvesRows(evolutions) {    
        
        let grid = [], trs = []
        this.createEvolvesGrid(evolutions, grid, 0)
        for (let row of grid) {

            let tds = []
            for (let id of row) {
                let pokemonId = Number(id)
                if (pokemonId) {
                    let name = PokedexHelper.getPokemonName(pokemonId)
                    tds.push(<td><SmallPokemon key={ pokemonId } 
                        id={ pokemonId } 
                        selected={ pokemonId === Number(this.state.selectedId) }
                        showGen={ this.props.showGen }
                        onClick={ id => this.onPokemonClicked(id) }/></td>)
                } else {
                    tds.push(<td></td>)
                }
            }

            trs.push(<tr>{ tds }</tr>)
        }

        return trs
    }

    onPokemonClicked(pokemonId) {
        if (this.props.onClick) {
            this.props.onClick(pokemonId)
            this.setState({ selectedId: pokemonId })
        }
    }

    render() {
        let evolutions = this.props.evolves, trs = null
        if (evolutions[0].children.length) {
            trs = this.generateEvolvesRows(evolutions);
        }
        
        return (
            <div className="zoom-container">
                <table><tbody>
                {trs}
                </tbody></table>
            </div>
        )
    }

}

function _addGridRow(grid) {
    let row = [0 ,0, 0]
    grid.push(row)
    return row
}
