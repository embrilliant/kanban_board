
function Ticket(title, description) {

    var ticketTitle = title; //string
    var ticketDescription = description;

    this.getTitle = function() {
        return ticketTitle;
    };

    this.getDescription = function() {
        return ticketDescription;
    };

    this.setTitle = function(newTitle) {
        ticketTitle = newTitle;
    };

    this.setDescription = function(newDescription) {
        ticketDescription = newDescription;
    };

    this.toSimpleTicket = function() {
        return {
            title: ticketTitle,
            description: ticketDescription
        }
    };

    ////test
    this.create = function(ticketTitle, ticketDescription, destinationColumn, ticketRenderFunc) {

    };

    function createATicket(ticketTitle, ticketDescription, destinationColumn, ticketRenderFunc) {
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        var reachedWipOrNot = destinationColumn.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket(ticketTitle, ticketDescription);
                destinationColumn.addOneTicket(newTicket);
                var newSimpleTicket = newTicket.toSimpleTicket();

                //localStorage
                var retrieveTicketsToDo = localStorageKanban.retrieveData("To_Do");

                storageHandle.addDataAndUpdate(retrieveTicketsToDo, newSimpleTicket, "To_Do");

                ticketRenderFunc(destinationColumn);
                errorMsg = "";
            } else {
                errorMsg = "Ticket already exists.";
                console.log("Ticket already exists.");
            }
        } else {
            errorMsg = "destination column reached WIP.";
            console.log("reached WIP.");
        }
        //1. create a ticket with Title and Description
        //2. set a destination column and add it to the array in that column
        //3. render the column that has the ticket
    }
}

