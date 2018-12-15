import React from 'react'

export default class FontIcon extends React.Component {
  render () {
    let classes = this.props.icon
    if (this.props.className) {
      classes += ' ' + this.props.className
    } else if (this.props.x2) {
      classes += ' fa-pokeman-2x'
    } else {
      classes += ' fa-pokeman-normal'
    }

    return (
      <i className={classes} aria-hidden='true' onClick={this.props.onClick} />
    )
  }
}
