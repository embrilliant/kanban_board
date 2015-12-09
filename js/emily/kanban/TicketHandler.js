
function TicketHandler( boardObj, renderObj, storageHandleObj, errorObj) {

    this.createATicket = function(ticketObj, destinationColumnObj) {
        var ticketExists = boardObj.checkIfATicketExistOnBoard( ticketObj.getTitle() );
        var reachedWipOrNot = destinationColumnObj.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket( ticketObj.getTitle(), ticketObj.getDescription() );
                destinationColumnObj.addOneTicket(newTicket);
                var newSimpleTicket = newTicket.toSimpleTicket();

                //localStorage
                if (storageHandleObj) {
                    storageHandleObj.addDataAndUpdate(newSimpleTicket, destinationColumnObj); //on create it's columns[0]
                }

                renderObj.ticket(destinationColumnObj);

                errorObj.setMsg("");
            } else {
                errorObj.setMsg("Ticket already exists.");
                console.log("Ticket already exists.");
            }
        } else {
            errorObj.setMsg("destination column reached WIP.");
            console.log("reached WIP.");
        }
        //1. create a ticket with Title and Description
        //2. set a destination column and add it to the array in that column
        //3. render the column that has the ticket
    };

    this.moveTicket = function(ticketObj, columnObj) {
        //1. check if ticket exists.
        var ticketExists = boardObj.checkIfATicketExistOnBoard( ticketObj.getTitle() ); // need ticketTitle
        if (ticketExists) {
            //2. find the column
            var columnOrigin = boardObj.findColumnByTicketTitle( ticketObj.getTitle() );
            var ticketFound = columnOrigin.findTicketByTitle( ticketObj.getTitle() );
            var columnFound = boardObj.findColumnByTitle( columnObj.getTitle() ); // need columnTitle
            var newSimpleTicket = ticketFound.toSimpleTicket();
            if (columnFound) {
                //check if reached Wip or not
                if ( !columnFound.reachedWipOrNot() ) {
                    //3. move the ticketFound to the columnFound
                    columnFound.addOneTicket(ticketFound);
                    columnOrigin.removeTicketByTitle( ticketObj.getTitle() );
                    renderObj.ticket( columnOrigin );
                    renderObj.ticket( columnFound );

                    //localStorage
                    ///Origin
                    storageHandleObj.removeDataAndUpdate( ticketObj.getTitle(), columnOrigin);

                    ///Found
                    storageHandleObj.addDataAndUpdate(newSimpleTicket, columnFound);

                    errorObj.setMsg("");
                } else {
                    errorObj.setMsg("Destination column reached WIP.");
                    console.log("reached WIP.");
                }
            } else {
                errorObj.setMsg("Cannot find such column.");
                console.log("Cannot find such column.");
            }
        } else {
            errorObj.setMsg("Ticket not found.");
            console.log("Ticket not found.");
        }
    };

    this.deleteTicket = function(ticketObj, columnDoneObj, extraAnimationObj) {
        var ticketExists = boardObj.checkIfATicketExistOnBoard( ticketObj.getTitle() );
        if (ticketExists) {
            var columnOrigin = boardObj.findColumnByTicketTitle(ticketObj.getTitle());
            if (columnOrigin.getTitle() === columnDoneObj.getTitle()) {
                columnDoneObj.removeTicketByTitle(ticketObj.getTitle());

                renderObj.ticket( columnDoneObj );
                errorObj.setMsg("");

                storageHandleObj.removeDataAndUpdate(ticketObj.getTitle(), columnOrigin);

                extraAnimationObj.startAnimate();
            } else {
                errorObj.setMsg("Ticket can only be deleted from Done.");
                console.log("Ticket can only be deleted from Done.");
            }
        } else {
            errorObj.setMsg("Ticket not found.");
            console.log("Ticket not found.");
        }
    };
}
