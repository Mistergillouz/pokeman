import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import '../../assets/styles/hamburger.css'

class Hamburger extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            country: PokedexHelper.getLocaleCountry()
        }
    }

    onShowEggPanel() {
        this.onToggleMenuVisibility()
        this.props.eventHandler({ eventType: Constants.EVENT.EggPage })
    }

    onToggleMenuVisibility() {
        setTimeout(() => {
            let navigation = this.refs.navigation;
            if (navigation) {
                navigation.classList.toggle('nav-opened')
            }
        }, 750)
        
    }

    onRadioCheck(country) {
        this.onToggleMenuVisibility()
        this.props.eventHandler({ eventType: Constants.EVENT.LocaleSelected, country: country })
        this.setState({ country: country })
    }

    generateLangRadio() {
        let radios = Object.keys(Constants.LOCALES).map(key => {
            let locale = Constants.LOCALES[key]
            let checkedClass = locale.country === this.state.country ? 'checked' : ''
            return (
                <li onClick={ () => this.onRadioCheck(locale.country) }>
                    <i className={ checkedClass }/>
                    <span>{ locale.name }</span>
                </li>
            )
        })

        return radios
    }

    render() { 

        return (
            <div>
                <div className="btn-navigation" onClick={ () => this.onToggleMenuVisibility() }>
                    <div className="btn-navigation-barre"></div>
                    <div className="btn-navigation-barre"></div>
                    <div className="btn-navigation-barre"></div>
                </div>
                <div className="navigation" ref="navigation">
                    <ul>
                        <li className="menu-section">Langues</li>
                        { this.generateLangRadio() }
                        <li className="nav-separator"></li>
                        <li className="menu-section">Autres</li>
                        <li onClick={ () => this.onShowEggPanel() }>
                            <img className='nav-icon' src='../assets/images/egg.png'/>
                            <span>Voir les oeufs</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Hamburger