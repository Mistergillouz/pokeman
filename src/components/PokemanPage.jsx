
import React from 'react'
import './css/pokeman.css'
import PokemanLink from './PokemanLink';

export default class PokemanPage extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {}
    }

    render() {

        if (this.props.share === 'false') {
            return null
        }

        return (
            <a href={ "whatsapp://send?text=Pokeman - " + encodeURIComponent(window.location.href) }>
                <div className='pokeman-button'/>
            </a>
        )
    }
}