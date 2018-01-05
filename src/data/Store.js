
class Store {
    
     constructor() {
         this.model = {}
     }

     set(key, data) {
        let value = this.model[key]
        if (value !== void 0) {
            if (typeof value === 'object' && typeof data === 'object') {
                return Object.assign(value, data)
            }
        }
        this.model[key] = data
        return data
     }

     get(key, defValues) {
         if (this.model[key]) {
             return this.model[key]
         }

         return this.set(key, defValues)
     }

     remove(key) {
         delete this.model[key]
     }
}
 
 // Singleton
 let storeObj = new Store()
 export default storeObj
 