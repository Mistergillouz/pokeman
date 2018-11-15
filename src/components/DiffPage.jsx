import React from 'react'
import { Redirect } from 'react-router-dom'

import PokedexHelper from '../data/PokedexHelper'
import PokemanPage from './PokemanPage'
import BackButton from './BackButton'
import Utils from '../data/Utils'
import Constants from '../data/Constants'
import SortTable from './SortTable'
import NotFound from './NotFound';
import Store from '../data/Store'

import './css/diffpage.less'

export default class DiffPage extends PokemanPage {

   constructor() {
      super('Differences', arguments)

      const gens = []
      for (let i = 0; i < Constants.CURRENT_GEN; i++) {
         gens.push(i + 1)
      }

      Object.assign(this.state, {
         selectedGens: gens,
         diffs: {},
         loading: true
      })

      const diffs = Store.get('diffs')
      if (diffs) {
         this.state.diffs = diffs
      } else {
         fetch(window.location.origin + '/diffs.json?_=' + Date.now())
            .then(response => {
               if (!response.ok) {
                  throw Error(response.status + '. Lors de la recuperation du fichier de comparaison des Pokemons.')
               }
               return response.json()
            })
            .then(data => {
               Store.set('diffs', data)
               this.setState({ diffs: data, loading: false })
            })
            .catch(error => this.setState({ error: error.toString() }))
      }
   }

   render() {

      if (this.state.error) {
         return <NotFound text={this.state.error} />
      }
      if (this.state.redirect) {
         return <Redirect push to={this.state.to} />
      }

      const genButtons = Utils.generateGenButtons(this.state.selectedGens, this.onGenClicked.bind(this), Constants.CURRENT_GEN)

      return <div className="page">
         <div className="navbar">
            <div className="left-panel">
               <BackButton />
            </div>
            <sup className='centered-text'>{this.getPageCaption()}</sup>
         </div>

         <div className="diff-filters">
            <span>Génération(s)</span>
            <div className="diff-filters-gens">
               {genButtons}
            </div>
         </div>

         <div className="compare-container">
            <SortTable columns={this.getColumns()} datas={this.getDatas()} onCellClicked={(row, col) => this.onCellClicked(row, col)} />
         </div>

         {super.render()}
      </div>
   }

   getColumns() {

      return [
         { text: 'Pokemon', align: 'left' },
         { text: 'PC', default: true, type: 'number', callback: this.formatValue },
         { text: 'ATK', type: 'number', callback: this.formatValue },
         { text: 'DEF', type: 'number', callback: this.formatValue },
         { text: 'RES', type: 'number', callback: this.formatValue }
      ]
   }

   formatValue(r, c, value) {
      if (value > 0) {
         return '+' + value
      } else if (value < 0) {
         return value
      }

      return undefined
   }

   getDatas() {

      const result = Object.keys(this.state.diffs)
         .filter(id => {
            const pokemon = PokedexHelper.getPokemon(id)
            return this.state.selectedGens.indexOf(pokemon.gen) !== -1
         })
         .map(id => {
            const pokemon = PokedexHelper.getPokemon(id)
            let name = PokedexHelper.loc(pokemon)
            if (pokemon.form) {
               name += ' (' + PokedexHelper.loc(pokemon.form) + ')'
            }
            const diff = this.state.diffs[id]
            return [
               name,
               diff.new.cp - diff.old.cp,
               diff.new.atk - diff.old.atk,
               diff.new.def - diff.old.def,
               diff.new.sta - diff.old.sta
            ]
         })

      return result
   }

   generateTable() {
      const shinies = PokedexHelper.getShinies().filter(pokemonId => this.state.selectedGens.indexOf(PokedexHelper.getPokemon(pokemonId).gen) !== -1)
      return shinies.map(pokemonId => <SmallPokemon id={pokemonId} shiny={true} onClick={() => this.onPokemonClicked(pokemonId)} />)
   }

   onCellClicked(row) {
      const pokemonId = Object.keys(this.state.diffs)[row]
      const pokemon = PokedexHelper.getPokemon(pokemonId)
      this.setState({ redirect: true, to: '/pokemon/' + pokemon.id })
   }

   onGenClicked(gen) {
      this.setState({ selectedGens: Utils.toggle(this.state.selectedGens, gen, false) })
   }
}
