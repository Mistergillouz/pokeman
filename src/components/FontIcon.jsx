import React from 'react'

export default class FontIcon extends React.Component {

    render() {

        let classes = 'fa ' + this.props.className + (this.props.x2 ? ' fa-pokeman-2x' : ' fa-pokeman-normal')
        return (
            <i className={ classes } aria-hidden="true" onClick={ this.props.onClick }/>
        )
    }
}