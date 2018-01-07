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
        this.onToggleMenuVisibilityAsync()
        this.props.eventHandler({ eventType: Constants.EVENT.EggPage })
    }

    onToggleMenuVisibilityAsync() {
        setTimeout(() => this.onToggleMenuVisibility() , 750)
    }

    onToggleMenuVisibility() {
        let navigation = this.refs.navigation;
        if (navigation) {
            navigation.classList.toggle('nav-opened')
        }
    }

    onRadioCheck(country) {
        this.props.eventHandler({ eventType: Constants.EVENT.LocaleSelected, country: country })
        this.setState({ country: country })
        this.onToggleMenuVisibilityAsync()
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

    startButtonAnimation() {
        let navigation = this.refs['btn-navigation']
        if (!navigation) {
            return
        }
        let animationListener = () => {
            navigation.removeEventListener('transitionend', animationListener)
            navigation.classList.remove('navigation-scale-anim')
            navigation.classList.add('navigation-scale-anim-end')
        }
        navigation.classList.add('navigation-scale-anim')
        navigation.addEventListener('transitionend', animationListener, false)
        
    }

    componentWillMount() {
        if (!Hamburger.ANIM_DONE) {
            Hamburger.ANIM_DONE = true
            setTimeout(() => this.startButtonAnimation(), 1000)
        }
    }

    render() { 

        return (
            <div>
                <div key="btn-nav" className="btn-navigation" ref='btn-navigation' onClick={ () => this.onToggleMenuVisibility() }>
                    <div className="btn-navigation-barre"></div>
                    <div className="btn-navigation-barre"></div>
                    <div className="btn-navigation-barre"></div>
                </div>
                <div key="nav-pan" className="navigation" ref="navigation">
                    <span className="navigation-title">POKEMAN</span>
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

Hamburger.ANIM_DONE = false

export default Hamburger