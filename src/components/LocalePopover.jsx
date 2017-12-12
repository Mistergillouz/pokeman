import React from 'react'

const LOCALES = [
    { id: 'fr', name: 'Français' },
    { id: 'en', name: 'English' }
]

class LocalePopover extends React.Component {
   
    constructor() {
        super(...arguments)
        this.renderLocale = this._renderLocale.bind(this)
    }

    _renderLocale(locale, index) {
        return (
            <li key={locale.id} 
                className="locale-item" 
                data-id={locale.id} 
                onClick={ this.props.onLocaleSelected }>
                {locale.name}
            </li>
        )
    }

    render() {

        return this.props.show && (
            <div className='popover'>
                <ul>
                    { LOCALES.map(this.renderLocale) }
                </ul>
            </div>
        )
    }
}

export default LocalePopover