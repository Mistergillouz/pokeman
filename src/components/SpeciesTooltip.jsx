import React from 'react'
import ReactDOM from 'react-dom';
import PokedexHelper from 'data/PokedexHelper'
import Species from 'components/Species'
import Constants from 'data/Constants'
import '../../assets/styles/speciestt.css'

class SpeciesTooltip extends React.Component {
   constructor() {
        super(...arguments)
        this.state = {
            tabId: 'atk'
        }
    }

    buildRows(data) {
        let rows = [], strength = [], weak = []
        Object.keys(data).forEach(id => {
            let percent = data[id]
            if (percent > 100) {
                strength.push(id)
            } else if (percent < 100) {
                weak.push(id)
            }
        })

        for (let i = 0; i < Math.max(strength.length, weak.length); i++) {
            rows.push(
                <tr>
                    { this.createAmountHtml(strength[i], data[strength[i]]) }
                    { this.createAmountHtml(weak[i], data[weak[i]]) }
                </tr>
            )
        }

        return rows;
    }

    buildAttacksRows(id) {
        let [data, _] = PokedexHelper.getDamageStrengthWeakness(id)
        return this.buildRows(data, false)
    }

    buildResistanceRows(id) {
        let [_, data] = PokedexHelper.getDamageStrengthWeakness(id)
        return this.buildRows(data, true)
    }


    createAmountHtml(id, percent) {
        if (id) {
            return (<td align="center"><Species id={ id }/></td>);
        }

        return <td></td>
    }

    onBlur() {
        this.props.eventHandler({
            eventType: Constants.EVENT.HideTooltip
        });
    }

    componentDidUpdate() {
        if (this.props.visible) {
            // Reposition tooltip within screen

            let node = ReactDOM.findDOMNode(this);
            let px = this.props.args.x, py = this.props.args.y
            let ttw = node.scrollWidth, tth = node.scrollHeight;
            let scw = document.body.clientWidth - 20, sch = document.documentElement.clientHeight - 20;
            let x = ((px + ttw) > scw) ? scw - ttw : px, y = ((py + tth) > sch) ? sch - tth : py;
            node.style.top = y + 'px';
            node.style.left = x + 'px';
            node.focus();
            this.updateVisibility()
        }
    }

    componentDidMount() {
        this.updateVisibility()
    }

    updateVisibility() {
        if (this.props.visible) {
            for (let tab of SpeciesTooltip.TABS) {
                let visible = this.state.tabId === tab.id
                let element = document.getElementById(tab.target)
                element.style.display = visible ? 'block' : 'none'
            }
        }
    }

    show(tabId) {
        this.setState({ tabId: tabId })
    }

    generateTabLink(tab) {
        let classes = 'species-tab-links'
        if (this.state.tabId === tab.id) {
            classes += ' active'
        }
        return <div className={ classes }  onClick={ () => this.show(tab.id) }>{ tab.text }</div>
    }

    render() { 

        if (!this.props.visible) {
            return null
        }

        let id = this.props.args.id;
        if (id !== -1) {
            let atkRows = this.buildAttacksRows(id)
            let resRows = this.buildResistanceRows(id)
            return (
                <div className="species-container" key={ id } tabIndex="-1" onBlur={() => this.onBlur() } >
                    <div className="species-tab">
                        { SpeciesTooltip.TABS.map(tab => this.generateTabLink(tab)) }
                    </div>

                    <div className="tooltip-table-container" onClick={ () => this.onBlur() }>
                        <table id="strength-table" className="tooltip-table">
                            <thead><tr><th>Fort vs</th><th>Faible vs</th></tr></thead>
                            <tbody>
                                { atkRows }
                            </tbody>
                        </table>
                        <table id="defense-table" className="tooltip-table">
                            <thead><tr><th>Faible vs</th><th>Fort vs</th></tr></thead>
                            <tbody>
                                { resRows }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
}

SpeciesTooltip.TABS = [
    { id: 'atk', text: 'Attaques', target: 'strength-table' },
    { id: 'def', text: 'Résistances', target: 'defense-table' }
]

export default SpeciesTooltip; 