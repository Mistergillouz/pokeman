
class Store {
    
     constructor() {
         this.model = {};
     }

     set(key, data) {
        if (this.model[key] === void 0) {
            this.model[key] = {};
        }
        return Object.assign(this.model[key], data)
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
 let storeObj = new Store();
 export default storeObj
 