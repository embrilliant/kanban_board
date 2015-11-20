

function LocalStore() {

    this.retrieveData = function(itemName) {
        return JSON.parse( localStorage.getItem(itemName) );
    };

    this.updateStorage = function(itemName, dataArray) {
        localStorage.setItem(itemName, JSON.stringify( dataArray ) );
    };

    this.addToArray = function(retrievedData, simpleTicket) {
        retrievedData.push(simpleTicket);
    };

    this.removeDataInArray = function(dataArray, valueToCheck) {
        var index;
        for (var i=0; i < dataArray.length; i++) {
            if (dataArray[i].title === valueToCheck ) {
                index = i;
            }
        }
        dataArray.splice(index, 1);
    };

    this.deleteStorageItem = function(itemName) {
        localStorage.removeItem(itemName);
    }

}