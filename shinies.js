const fs = require('fs')


const LAST_ID = 493
const ADD_ID = [808, 809]

const shinies = [], pokemons = []
fs.readdirSync('./assets/pokemons/shiny').forEach(f => add(shinies, f))
fs.readdirSync('./assets/pokemons').forEach(f => add(pokemons, f))

function add(array, fileName) {
   const index = fileName.indexOf('.png')
   if (index === -1) {
      return
   }
   const id = Number(fileName.substring(0, index))
   if (id) {
      if (ADD_ID.indexOf(id) !== -1 || id < LAST_ID) {
         array.push(id)
      }
   }
}

pokemons.forEach(id => {
   const index = shinies.indexOf(id)
   if (index < 0) {
      console.log(id)
   }
})

