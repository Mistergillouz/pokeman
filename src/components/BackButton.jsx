import React from 'react'
import { Link } from 'react-router-dom'

export default class BackButton extends React.Component {
    render() {
        return (
            <Link to={{ pathname: '/' }}>
                <button className="back-button"/>
            </Link>
        )
    }
}