
import React from 'react'
import PokedexHelper from '../data/PokedexHelper'
import PokemanLink from './PokemanLink'
import NotFound from './NotFound'
import Utils from '../data/Utils'
import './css/pokeman.css'
import Constants from '../data/Constants'

export default class PokemanPage extends React.Component {
  constructor (caption, args) {
    super(...args)

    this.isComponentMounted = false

    const href = window.location.href
    const index = href.indexOf('?')

    this.baseUrl = index === -1 ? href : href.substring(0, index)
    this.params = new URLSearchParams(index === -1 ? '' : href.substring(index + 1))

    this.state = {
      caption
    }
  }

  render () {
    if (!Utils.isMobileDevice()) {
      return null
    }

    const params = unescape(this.params.toString())
    const text = this.getPageCaption() + ' - ' + escape(this.baseUrl) + this.getUrlParams(params)
    return (
      <a href={'whatsapp://send?text=' + text}>
        <div className='pokeman-button' />
      </a>
    )
  }

  getUrlParams (params) {
    return params.length ? '?' + escape(params) : ''
  }

  setUrlParam (name, value) {
    this.params.set(name, value)
    this.setState({ render: true })
  }

  componentDidMount () {
    this.isComponentMounted = true
  }

  getPageCaption () {
    return this.state.caption || Constants.APPNAME
  }

  setPageCaption (caption) {
    if (caption !== this.getPageCaption()) {
      setTimeout(() => this.setState({ caption }), 150)
    }
  }

  getPokemon () {
    if (this.props && this.props.match && this.props.match.params) {
      return PokedexHelper.getPokemon(this.props.match.params.id)
    }

    return null
  }

  generatePokemonFail () {
    return (
      <PokemanLink to='/'>
        <NotFound text='Impossible de recupérer les informations du pokemon' />
      </PokemanLink>
    )
  }
}
