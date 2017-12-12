import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

class LocalePopover extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    renderLocale(locale) {
        return (
            <li key={locale.id} 
                className="locale-item" 
                onClick={ () => this.props.onLocaleSelected(locale.id) }>
                {locale.name}
            </li>
        )
    }

    render() {

        return this.props.show && (
            <div className='popover'>
                <ul>
                    { PokedexHelper.getLocales().map((locale) => this.renderLocale(locale)) }
                </ul>
            </div>
        )
    }
}

export default LocalePopover