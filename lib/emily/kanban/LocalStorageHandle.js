
function LocalStorageHandle(LocalStoreObject) {

    this.addDataAndUpdate = function(retrieveDataFound, simpleTicket, columnNameForLocalStorageFound) {
        ////add
        LocalStoreObject.addToArray(retrieveDataFound, simpleTicket);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorageFound, retrieveDataFound);
    };

    this.removeDataAndUpdate = function(retrieveDataOrigin, ticketTitle, columnNameForLocalStorageOrigin) {
        ///remove
        LocalStoreObject.removeDataInArray(retrieveDataOrigin, ticketTitle);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorageOrigin, retrieveDataOrigin);
    };

    this.storageItemClearAndUpdate = function(itemName, column) {
        LocalStoreObject.deleteStorageItem(itemName);
        LocalStoreObject.updateStorage( itemName, column.showAllTicket() );
    };


}