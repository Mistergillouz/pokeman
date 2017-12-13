import React from 'react'
import ReactDOM from 'react-dom'

class Lazimage extends React.Component {
   constructor() {
        super(...arguments)
        this.updateFunct = this.update.bind(this);
        this.state = {};

        this.wait = false;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.updateFunct, false);
        window.addEventListener('resize', this.updateFunct, false);
        this.update();
    }
    
    componentWillUnmount() {
        this.detach();
    }

    isVisible() {
        let node = ReactDOM.findDOMNode(this);
        var rect = node.getBoundingClientRect();
        
        let visible = (rect.top >= 0 && rect.left >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
            rect.left <= (window.innerWidth || document.documentElement.clientWidth));

        return visible;
    }

    update() {
        if (this.wait && this.isVisible()) {
            this.setState({ src: this.props.target });
        }
    }

    onLoad() {

        if (!this.wait) {
            // "Loading please wait" image is loaded
            this.wait = true;
            this.update();  
        } else {
            this.detach();
        }
    }

    detach() {
        window.removeEventListener('scroll', this.updateFunct);
        window.removeEventListener('resize', this.updateFunct);
    }

    render() { 
        var img = this.state.src || this.props.src;
        return (
            <img src= { img } onLoad={ () => this.onLoad() }/>
        )
    }
}

export default Lazimage; 