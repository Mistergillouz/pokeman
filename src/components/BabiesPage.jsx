import PokedexHelper from '../data/PokedexHelper'
import SmallPokemon from './SmallPokemon'
import BackButton from './BackButton'
import PokemanLink from './PokemanLink'
import PokemanPage from './PokemanPage'

import './css/babies.css'

export default class BabiesPage extends PokemanPage {
  constructor () {
    super('Maternelle', arguments)
  }

  render () {
    return (
      <div className='baby-container'>
        <div className='navbar'>
          <div className='left-panel'>
            <BackButton />
          </div>
          <sup className='centered-text'>{ this.getPageCaption() }</sup>
        </div>

        <div className='baby-results'>
          { PokedexHelper.getBabies().map(pokemonId => {
            return (
              <PokemanLink to={'/pokemon/' + pokemonId}>
                <SmallPokemon id={pokemonId} showGen='true' />
              </PokemanLink>
            )
          })}
        </div>

        { super.render() }

      </div>
    )
  }
}
