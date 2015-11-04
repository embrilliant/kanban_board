function Board(name, numberOfColumns) {

    var boardName = name;
    var numberOfColumns = numberOfColumns;

    var arrayOfColumns = [];

    this.getBoardName = function() {
        return boardName;
    };

    this.getNumberOfColumns = function() {
        return numberOfColumns;
    };

    this.getAllColumns = function() {
        return arrayOfColumns;
    };

    this.addOneColumnsToBoard = function(columnToBeAdded) {
        arrayOfColumns.push(columnToBeAdded);
    };

    this.removeOneColumnByTitle = function(columnTitle) {
        var obj;
        var index;
        for (var i=0; i < arrayOfColumns.length; i++) {
            if (arrayOfColumns[i].getTitle() === columnTitle ) {
                obj = arrayOfColumns[i];
                index = i;
            }
        }
        arrayOfColumns.splice(index, 1);
    };

    this.getColumnCount = function() {
        return arrayOfColumns.length;
    };

    this.findColumnByTitle = function(columnTitle) {
        for (var i=0; i < arrayOfColumns.length; i++) {
            if (arrayOfColumns[i].getTitle() === columnTitle ) {
                return arrayOfColumns[i];
            }
        }
    };

    this.findColumnByTicketTitle = function(ticketTitle) {
        for (var i=0; i < arrayOfColumns.length; i++) {
            for (var s=0; s < arrayOfColumns[i].getTicketCount(); s++) {
                var thisTicket = arrayOfColumns[i].showAllTicket()[s];
                if ( thisTicket.getTitle() === ticketTitle ) {
                    return arrayOfColumns[i];
                }
            }
        }
    };

    this.checkIfATicketExistOnBoard = function(ticketTitle) {
        for (var i=0; i < arrayOfColumns.length; i++) {
            for (var s=0; s < arrayOfColumns[i].getTicketCount(); s++) {
                var thisTicket = arrayOfColumns[i].showAllTicket()[s];
                return ( thisTicket.getTitle() === ticketTitle )
            }
        }
    };

}