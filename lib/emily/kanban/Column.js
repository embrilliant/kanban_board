
function Column(title, wip) {

    var columnTitle = title;
    var wipNum = wip;

    var arrayOfTickets = [];

    //??
    //this.title = title;
    //this.wip = wip;

    this.getTitle = function() {
        return columnTitle;
    };

    this.getWipNumber = function() {
        return wipNum;
    };

    this.showAllTicket = function() {
        return arrayOfTickets;
    };

    this.reachedWipOrNot = function() {
        if ( arrayOfTickets.length < wipNum ) {
            return false;
        } else {
            return true;
        }
    };

    this.addOneTicket = function(ticket) {
        arrayOfTickets.push(ticket);
    };

    this.findTicketByTitle = function(ticketTitle) {
        for (var i=0; i < arrayOfTickets.length; i++) {
            if (arrayOfTickets[i].getTitle() === ticketTitle ) {
                return arrayOfTickets[i];
            }
        }
    };

    this.removeTicketByTitle = function(ticketTitle) {
        var obj;
        var index;
        for (var i=0; i < arrayOfTickets.length; i++) {
            if (arrayOfTickets[i].getTitle() === ticketTitle ) {
                obj = arrayOfTickets[i];
                index = i;
            }
        }
        arrayOfTickets.splice(index, 1);
    };

    this.getTicketCount = function() {
        return arrayOfTickets.length;
    };

}

