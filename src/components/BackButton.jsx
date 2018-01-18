import React from 'react'
import { Link } from 'react-router-dom'

export default class BackButton extends React.Component {

    constructor() {
        super(...arguments)
    }

    render() {
        if (this.props.history) {
            return <button className="back-button" onClick={ () => this.props.history.goBack() }/>
        } else {
            return (
                <Link to={{ pathname: '/' }}>
                    <button className="back-button"/>
                </Link>
            )
        }
    }
}