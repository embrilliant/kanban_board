
function LocalStorageHandle(LocalStoreObject) {

    this.addDataAndUpdate = function(simpleTicket, column) {

        var columnNameForLocalStorage = column.getTitle().replace(/ /g, '_');

        ////retrieve data
        var retrieveDataArray = LocalStoreObject.retrieveData(columnNameForLocalStorage);

        ////add
        LocalStoreObject.addToArray(retrieveDataArray, simpleTicket);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorage, retrieveDataArray);
    };

    this.removeDataAndUpdate = function(ticketTitle, column) {

        ///Origin
        var columnNameForLocalStorageOrigin = column.getTitle().replace(/ /g, '_');
        ////retrieve
        var retrievedData = LocalStoreObject.retrieveData(columnNameForLocalStorageOrigin);

        ///remove
        LocalStoreObject.removeDataInArray(retrievedData, ticketTitle);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorageOrigin, retrievedData);
    };

    this.storageItemClearAndUpdate = function(itemName, column) {
        LocalStoreObject.deleteStorageItem(itemName);
        LocalStoreObject.updateStorage( itemName, column.showAllTicket() );
    };

}
