$(function() {

    var newBoard = new Board("Kanban", 4);
    var errorMsg;

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    newBoard.addOneColumnsToBoard(columnToDo);
    newBoard.addOneColumnsToBoard(columnInProgress);
    newBoard.addOneColumnsToBoard(columnReview);
    newBoard.addOneColumnsToBoard(columnDone);

    function boardRender() {
        var boardName = newBoard.getBoardName();
        var cssClass = newBoard.constructor.name.toLowerCase();
        var $newDiv = $('<div/>',{ id: boardName, "class": cssClass});
        $("#container").append($newDiv);
    }

    function columnRender(boardName) {
        var arrayOfColumns = newBoard.getAllColumns();
        for (var i = 0; i < newBoard.getColumnCount(); i++) {
            var columnTitle = arrayOfColumns[i].getTitle();
            var divId = columnTitle.replace(/ /g,'_');
            var cssClass = arrayOfColumns[i].constructor.name.toLowerCase();
            var $newDiv = $('<div/>',{ id: divId, "class": cssClass});
            $newDiv.append("<header>"+ columnTitle +" ("+ arrayOfColumns[i].getWipNumber() +") </header><section></section>");
            $("#"+boardName).append($newDiv);
        }
    }

    function ticketRender(column) {
        var whichBoard = column.getTitle().replace(/ /g, '_');
        var $board = $("#" + whichBoard);
        $board.find("section").html("");
        var arrayOfTickets = column.showAllTicket();
        if ( arrayOfTickets.length > 0 ) {
            for (var i = 0; i < column.getTicketCount(); i++) {
                var ticketTitle = arrayOfTickets[i].getTitle();
                var ticketDescription = arrayOfTickets[i].getDescription();
                var cssClass = arrayOfTickets[i].constructor.name.toLowerCase();
                var $newDiv = $('<div/>', {"class": cssClass});
                $newDiv.html("Title: "+ ticketTitle +"<br>Description: "+ ticketDescription);
                $board.find("section").append($newDiv);
            }
        }
    }

    function createATicket(ticketTitle, ticketDescription, destinationColumn) {
        //check if ticket already exist on the whole board
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        var reachedWipOrNot = destinationColumn.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket(ticketTitle, ticketDescription);
                destinationColumn.addOneTicket(newTicket);
                ticketRender(destinationColumn);
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

    boardRender();

    columnRender("Kanban");

    $("#create_a_ticket").on("click", function(e) {
        e.preventDefault();
        var title = $("input[name='ticket_title']").val();
        var description = $("input[name='ticket_description']").val();
        if (title.length != 0 && description != 0) {
            createATicket(title, description, columnToDo);
        } else {
            errorMsg = "Please enter title and description.";
        }
    });

    $("#move_ticket").on("click", function(e) {
        e.preventDefault();
        //1. find the ticket
        var ticketTitle = $("input[name='ticket_title']").val();
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        if (ticketExists) {
            var columnOrigin = newBoard.findColumnByTicketTitle(ticketTitle);
            var ticketFound = columnOrigin.findTicketByTitle(ticketTitle);
            //2. find the column
            var columnTitle = $("input[name='column_title']").val();
            var columnFound = newBoard.findColumnByTitle(columnTitle);
            if (columnFound) {
                if ( !columnFound.reachedWipOrNot() ) {
                    columnFound.addOneTicket(ticketFound);
                    columnOrigin.removeTicketByTitle(ticketTitle);
                    ticketRender(columnOrigin);
                    ticketRender(columnFound);
                    errorMsg = "";
                } else {
                    errorMsg = "destination column reached WIP.";
                    console.log("reached WIP.");
                }
                //3. move the ticketFound to the columnFound
            } else {
                errorMsg = "Cannot find such column.";
                console.log("Cannot find such column.");
            }
        } else {
            errorMsg = "Ticket not found.";
            console.log("Ticket not found.");
        }
    });

    $("#delete_ticket").on("click", function(e) {
        e.preventDefault();
        var ticketTitle = $("input[name='ticket_title']").val();
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        if (ticketExists) {
            var columnOrigin = newBoard.findColumnByTicketTitle(ticketTitle);
            if (columnOrigin.getTitle() === columnDone.getTitle()) {
                columnDone.removeTicketByTitle(ticketTitle);
                ticketRender(columnDone);
                errorMsg = "";
            } else {
                errorMsg = "Ticket can only be deleted from Done.";
                console.log("Ticket can only be deleted from Done.");
            }
        } else {
            errorMsg = "Ticket not found.";
            console.log("Ticket not found.");
        }
    });

    $("button").on("click", function() {
        $("#errorMsg").text(errorMsg);
    });
});

