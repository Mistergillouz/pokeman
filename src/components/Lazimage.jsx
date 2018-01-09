import React from 'react'
import ReactDOM from 'react-dom'

class Lazimage extends React.Component {
   constructor() {
        super(...arguments)
        this.updateFunct = this.update.bind(this);

        this.waitLoaded = false;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.updateFunct, true);
        window.addEventListener('resize', this.updateFunct, false);
    }
    
    componentWillUnmount() {
        this.detach();
    }

    componentWillReceiveProps() {
        if (!this.visible) {
            setTimeout(() => this.update(), 150)
        }
    }

    isVisible() {

        let node = ReactDOM.findDOMNode(this);
        let rect = node.getBoundingClientRect();
    
        let visible = (rect.top >= 0 && rect.left >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
            rect.left <= (window.innerWidth || document.documentElement.clientWidth));

        return visible;
    }

    update(e) {
        if (this.waitLoaded && this.isVisible()) {
            this.visible = true
            this.forceUpdate()
            this.detach();
            return true;
        }

        return false;
    }

    onLoad() {

        // "Loading please wait" image is loaded
        if (!this.waitLoaded) {
            this.waitLoaded = true;
            this.update();
        }
    }

    detach() {
        window.removeEventListener('scroll', this.updateFunct, true);
        window.removeEventListener('resize', this.updateFunct);
    }

    render() { 
        var img = this.visible ? this.props.target : this.props.src;
        
        return (
            <img src={ img } onLoad={ () => this.onLoad() } className={ this.props.className }/>
        )
    }
}

export default Lazimage; 