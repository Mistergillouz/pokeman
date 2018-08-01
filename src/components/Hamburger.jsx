import React from 'react'
import PokemanLink from './PokemanLink'
import FontIcon from './FontIcon'
import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import './css/hamburger.css'

class Hamburger extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            country: PokedexHelper.getLocaleCountry(),
            opened: false
        }
    }

    onToggleMenuVisibilityAsync() {
        setTimeout(() => this.onToggleMenuVisibility() , 150)
    }

    onToggleMenuVisibility(e) {
        this.setState({ opened: !this.state.opened })
    }

    onRadioCheck(country) {
        this.props.eventHandler({ eventType: Constants.EVENT.LocaleSelected, country: country })
        this.setState({ country: country })
    }

    generateLangRadio() {
        let radios = Object.keys(Constants.LOCALES).map(key => {
            let locale = Constants.LOCALES[key]
            let checkedClass = locale.country === this.state.country ? 'checked' : ''
            return (
                <li key={ locale.country } onClick={ () => this.onRadioCheck(locale.country) }>
                    <i className={ checkedClass }/>
                    <span>{ locale.name }</span>
                </li>
            )
        })

        return radios
    }

    onSelect(select) {
        this.props.eventHandler({ eventType: Constants.EVENT.PokemonSelected, id: select })
    }

    render() { 

        if (this.state.redirect) {
            return <Redirect to={ this.state.to }/>
        }

        let btnIcon = this.state.opened ? 'fa-close' : 'fa-bars'
        let toggle = this.state.opened ? 'nav-opened' : ''
        return (
            <div>
                <FontIcon key="nav" icon={ btnIcon } className="btn-navigation fa-pokeman-normal" ref='btn-navigation' onClick={ e => this.onToggleMenuVisibility(e) }/>
                <div key="nav-pan" className={ 'navigation '  + toggle } ref="navigation" onClick={ () => this.onToggleMenuVisibility() }>
                    <ul>
                        <li className="menu-section">Langues</li>
                        { this.generateLangRadio() }
                        <li className="nav-separator"></li>

                        <PokemanLink to='/eggs'>
                            <li>
                                <p className='nav-icon-egg'/>
                                <a>Voir les oeufs</a>
                            </li>
                        </PokemanLink>

                        <PokemanLink to='/evolutions'>
                            <li>
                                <p className='nav-icon-evolves'/>
                                <a>Evolutions explorer</a>
                            </li>
                        </PokemanLink>

                        <PokemanLink to='/babies'>
                            <li>
                                <p className='nav-icon-baby'/>
                                <a>Maternelle</a>
                            </li>
                        </PokemanLink>

                        <PokemanLink to='/forms'>
                            <li>
                                <p className="fa fa-random" aria-hidden="true"/>
                                <a>Formes</a>
                            </li>
                        </PokemanLink>

                        <PokemanLink to='/shinies'>
                            <li>
                                <p className="fa fa-hand-o-right" aria-hidden="true"/>
                                <a>Shinies</a>
                            </li>
                        </PokemanLink>

                    </ul>
                </div>
            </div>
        )
    }
}

export default Hamburger