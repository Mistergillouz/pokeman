import React from 'react'
import ScriptJS from 'scriptjs'

import BackButton from 'components/BackButton'
import PokemanPage from 'components/PokemanPage'
import PokedexHelper from 'data/PokedexHelper'

import './css/ranking.css'

export default class RankingPage extends PokemanPage {

    constructor() {
        super(null, arguments)

        this.state = {}
        this.gauges = {}

        this.state.pokemon = this.getPokemon()

        if (this.state.pokemon) {
            this.setPageCaption(PokedexHelper.loc(this.state.pokemon))
            if (!window.google) {
                ScriptJS('https://www.gstatic.com/charts/loader.js', response => {
                    this.setState({ google: true })
                })
            }
        } 
    }

    componentDidMount() {
        this.renderCharts()
    }

    componentDidUpdate() {
        let pokemon = this.getPokemon()
        if (this.state.pokemon === pokemon) {
            this.renderCharts()
        } else {
            this.setState({ pokemon: pokemon })
        }
    }

    renderCharts() {

        if (!window.google || !this.state.pokemon) {
            return
        }

        let rankings = PokedexHelper.getRankings(this.props.match.params.id)
        let options = {

            min: 1,
            max: rankings.count,

            greenFrom: 0, 
            greenTo: 50,

            yellowFrom: 51, 
            yellowTo: rankings.count - 50,
            yellowColor: '#ffffff',

            redFrom: rankings.count - 50,
            redTo: rankings.count,

            animation:{
                duration: 1000,
                easing: 'inAndOut'
            },

            minorTicks: 5
        };

        this.renderGauge('PC', rankings.cpmax, options, 'ranking-pc-container')
        this.renderGauge('Attaque', rankings.atk,options, 'ranking-atk-container')
        this.renderGauge('Défense', rankings.def, options, 'ranking-def-container')
        this.renderGauge('Résists', rankings.sta, options, 'ranking-sta-container')
    }

    renderGauge(name, value, gaugeOptions, elementId) {

        google.charts.load('current', {'packages':['gauge']});
        google.charts.setOnLoadCallback(() => {

            const ANIM_WAIT = 750
            let gaugeData = this.createGaugeData(name, value, gaugeOptions.max)
            let chart = new google.visualization.Gauge(document.getElementById(elementId));
            chart.draw(gaugeData, gaugeOptions);
        })
    }

    createGaugeData(name, value, max) {

        let gaugeData = new google.visualization.DataTable();
        gaugeData.addColumn('number', name)
        gaugeData.addRows(1)
        gaugeData.setCell(0, 0, value)

        var formatter = new google.visualization.NumberFormat(
            {suffix: 'éme', pattern:'#'}
        )

        formatter.format(gaugeData, 0)
        return gaugeData
    }

    render() { 

        if (!this.state.pokemon) {
            return this.generatePokemonFail()
        }

        return (
            
            <div className="ranking-main-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton history={ this.props.history }/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                    </div>
                </div>

                <div key="ranking-container" ref="ranking-container" className="ranking-container">
                    <div id="ranking-pc-container"></div>
                    <div id="ranking-atk-container"></div>
                    <div className="ranking-def-sta">
                        <div id="ranking-def-container"></div>
                        <div id="ranking-sta-container"></div>
                    </div>
                </div>

                { super.render() }
            </div>

            
        )
    }
}
