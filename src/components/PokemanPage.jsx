
import React from 'react'
import './css/pokeman.css'
import PokemanLink from './PokemanLink';
import Utils from 'data/Utils';

export default class PokemanPage extends React.Component {

    constructor(caption, args) {
        super(...args)
        this.caption = caption
        this.state = {}
    }

    render() {

        if (!Utils.isMobileDevice()) {
            return null
        }

        let text = (this.caption || 'Pokeman') + ' - ' + encodeURIComponent(window.location.href)
        return (
            <a href={ 'whatsapp://send?text=' + text }>
                <div className='pokeman-button'/>
            </a>
        )
    }

    getPageCaption() { return this.caption || '' }
    setPageCaption(caption) { this.caption = caption }
}