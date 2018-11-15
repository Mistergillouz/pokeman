import Utils from './Utils'

class Store {
    
    constructor() {
        this.model = {}
    }

    set(key, data) {
        let value = this.model[key]
        if (value !== void 0) {
           if (_isObject(value)) {
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

function _isObject (item) {
    return (typeof item === 'object' && !Array.isArray(item) && item !== null);
  }

 // Singleton
 let storeObj = new Store()
 export default storeObj
 