import React from 'react'
import { withRouter, Link, Redirect } from 'react-router-dom'

class PokemanLink extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {}
    }

    onClick() {
        if (this.props.back) {
            this.props.history.goBack()
        } else {
            this.setState({ redirect: true })
        }
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to={ this.props.to }/>
        }
        if (this.props.to) {
            return <Link to={ this.props.to }>{ this.props.children }</Link>
        }

        return <a onClick={ () => this.onClick() }>{ this.props.children }</a>
    }
}

export default withRouter(PokemanLink)