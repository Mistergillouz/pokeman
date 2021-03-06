import React from 'react'
import PokedexHelper from '../data/PokedexHelper'

class Species extends React.Component {
  render () {
    let species = PokedexHelper.getTypeInfos(this.props.id)
    let speciesName = PokedexHelper.loc(species)
    var speciesCss = PokedexHelper.getSpeciesKey(species)

    return (
      <div key={speciesCss} className={'type POKEMON_TYPE_' + speciesCss} type-id={species.id}>{ speciesName }
      </div>
    )
  }
}

export default Species
