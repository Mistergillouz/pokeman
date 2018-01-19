
import React from 'react'
import './css/pokeman.css'
import PokemanLink from './PokemanLink';
import Utils from '../data/Utils';

export default class PokemanPage extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {}
    }

    render() {

        if (!Utils.isMobileDevice()) {
            return null
        }

        return (
            <a href={ "whatsapp://send?text=Pokeman - " + encodeURIComponent(window.location.href) }>
                <div className='pokeman-button'/>
            </a>
        )
    }
}