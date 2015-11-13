$(function() {

    var newBoard = new Board("Kanban", 4);
    var errorMsg;

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    var columns = [columnToDo, columnInProgress, columnReview, columnDone];

    for (var i = 0; i < columns.length; i++) {
        newBoard.addOneColumnsToBoard(columns[i]);
    }

    var retrieveTicketsToDo = JSON.parse( localStorage.getItem("To_Do") );
    var retrieveTicketsInProgress = JSON.parse( localStorage.getItem("In_Progress") );
    var retrieveTicketsReview = JSON.parse( localStorage.getItem("Review") );
    var retrieveTicketsDone = JSON.parse( localStorage.getItem("Done") );

    console.log(retrieveTicketsToDo);
    console.log(retrieveTicketsInProgress);
    console.log(retrieveTicketsReview);
    console.log(retrieveTicketsDone);

    var dAndD = new function() {
        var draggedTicketTitle;

        this.allowDrop = function(event) {
            event.preventDefault();
        };

        this.drag = function(event) {
            draggedTicketTitle = $(event.target).find("span").text();
        };

        this.drop = function(event, moveTicketFunc, ticketRenderFunc) {
            event.preventDefault();
            var $target = $(event.target);
            var destinationColumnTitle = $target.siblings("header").find("span").text();
            moveTicketFunc(draggedTicketTitle, destinationColumnTitle, ticketRenderFunc);
            $("#errorMsg").text(errorMsg);
        };
    };

    function initRetrievedDataRender(retrievedData, name, column) {
        if (retrievedData === null) {
            localStorage.setItem(name, JSON.stringify( column.showAllTicket() ) );
            retrievedData = JSON.parse( localStorage.getItem(name) );
        }

        for (var i = 0; i < retrievedData.length; i++ ) {
            var title = retrievedData[i].title;
            var description = retrievedData[i].description;
            var newTicket = new Ticket(title, description);
            column.addOneTicket(newTicket);
        }

        ticketRender(column);
    }

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
            $newDiv.append("<header><span>"+ columnTitle +"</span> ("+ arrayOfColumns[i].getWipNumber() +") </header><section></section>");
            $("#"+boardName).append($newDiv);
            //find child element javascript
            var theColumn = $newDiv.get(0);
            theColumn.getElementsByTagName("section")[0].addEventListener("dragover", dAndD.allowDrop, false);
            theColumn.getElementsByTagName("section")[0].addEventListener("drop", function() {
                dAndD.drop(event, moveTicket, ticketRender);
            }, false);
        }
    }

    function createATicket(ticketTitle, ticketDescription, destinationColumn, ticketRenderFunc) {
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        var reachedWipOrNot = destinationColumn.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket(ticketTitle, ticketDescription);
                destinationColumn.addOneTicket(newTicket);
                var newSimpleTicket = newTicket.toSimpleTicket();

                //localStorage
                retrieveTicketsToDo.push(newSimpleTicket);
                localStorage.setItem("To_Do", JSON.stringify( retrieveTicketsToDo ) );
                //localStorage

                errorMsg = "";
            } else {
                errorMsg = "Ticket already exists.";
                console.log("Ticket already exists.");
            }
        } else {
            errorMsg = "destination column reached WIP.";
            console.log("reached WIP.");
        }
        ticketRenderFunc(columnToDo);
        //1. create a ticket with Title and Description
        //2. set a destination column and add it to the array in that column
        //3. render the column that has the ticket
    }

    function ticketRender(column) {
        var whichColumn = column.getTitle().replace(/ /g, '_');
        var $board = $("#" + whichColumn);
        $board.find("section").html("");
        var arrayOfTickets = column.showAllTicket();
        if ( arrayOfTickets.length > 0 ) {
            for (var i = 0; i < column.getTicketCount(); i++) {
                var ticketTitle = arrayOfTickets[i].getTitle();
                var ticketDescription = arrayOfTickets[i].getDescription();
                var cssClass = arrayOfTickets[i].constructor.name.toLowerCase();
                var $newDiv = $('<div/>', {"class": cssClass,
                                            "draggable": "true"
                                            });
                $newDiv.html("Title: <span>"+ ticketTitle +"</span><br>Description: "+ ticketDescription);
                $board.find("section").append($newDiv);
                var newDiv = $newDiv.get(0);//
                newDiv.addEventListener("dragstart", dAndD.drag, false);
            }
        }
    }

    function moveTicket(ticketTitle, columnTitle, ticketRenderFunc) {
        //1. check if ticket exists.
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle); // need ticketTitle
        if (ticketExists) {
            //2. find the column
            var columnOrigin = newBoard.findColumnByTicketTitle(ticketTitle);
            var ticketFound = columnOrigin.findTicketByTitle(ticketTitle);
            var columnFound = newBoard.findColumnByTitle(columnTitle); // need columnTitle
            var newSimpleTicket = ticketFound.toSimpleTicket();
            if (columnFound) {
                //check if reached Wip or not
                if ( !columnFound.reachedWipOrNot() ) {
                    //3. move the ticketFound to the columnFound
                    columnFound.addOneTicket(ticketFound);
                    columnOrigin.removeTicketByTitle(ticketTitle);
                    ticketRenderFunc(columnOrigin);
                    ticketRenderFunc(columnFound);

                    //localStorage
                    //Origin
                    var columnNameForLocalStorageOrigin = columnOrigin.getTitle().replace(/ /g, '_');
                    var retrieveDataO = JSON.parse( localStorage.getItem(columnNameForLocalStorageOrigin) );
                        var index;
                        for (var i=0; i < retrieveDataO.length; i++) {
                            if (retrieveDataO[i].title === ticketTitle ) {
                                index = i;
                            }
                        }
                    retrieveDataO.splice(index, 1);
                    localStorage.setItem(columnNameForLocalStorageOrigin, JSON.stringify( retrieveDataO ) );

                    //Found
                    var columnNameForLocalStorageFound = columnFound.getTitle().replace(/ /g, '_');
                    var retrieveDataF = JSON.parse( localStorage.getItem(columnNameForLocalStorageFound) );
                    retrieveDataF.push(newSimpleTicket);
                    localStorage.setItem(columnNameForLocalStorageFound, JSON.stringify( retrieveDataF ) );
                    //localStorage

                    errorMsg = "";
                } else {
                    errorMsg = "destination column reached WIP.";
                    console.log("reached WIP.");
                }
            } else {
                errorMsg = "Cannot find such column.";
                console.log("Cannot find such column.");
            }
        } else {
            errorMsg = "Ticket not found.";
            console.log("Ticket not found.");
        }
    }

    function deleteTicket(ticketTitle, ticketRenderFunc) {
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        if (ticketExists) {
            var columnOrigin = newBoard.findColumnByTicketTitle(ticketTitle);
            if (columnOrigin.getTitle() === columnDone.getTitle()) {
                columnDone.removeTicketByTitle(ticketTitle);
                ticketRenderFunc(columnDone);
                errorMsg = "";

                //localStorage
                var columnNameForLocalStorageOrigin = columnOrigin.getTitle().replace(/ /g, '_'); //"Done"
                var retrieveDataO = JSON.parse( localStorage.getItem(columnNameForLocalStorageOrigin) );

                    var index;
                    for (var i=0; i < retrieveDataO.length; i++) {
                        if (retrieveDataO[i].title === ticketTitle ) {
                            index = i;
                        }
                    }
                retrieveDataO.splice(index, 1);
                localStorage.setItem(columnNameForLocalStorageOrigin, JSON.stringify( retrieveDataO ) );
                //localStorage

            } else {
                errorMsg = "Ticket can only be deleted from Done.";
                console.log("Ticket can only be deleted from Done.");
            }
        } else {
            errorMsg = "Ticket not found.";
            console.log("Ticket not found.");
        }
    }

    boardRender();
    columnRender("Kanban");

    initRetrievedDataRender(retrieveTicketsToDo, "To_Do", columnToDo);
    initRetrievedDataRender(retrieveTicketsInProgress, "In_Progress", columnInProgress);
    initRetrievedDataRender(retrieveTicketsReview, "Review", columnReview);
    initRetrievedDataRender(retrieveTicketsDone, "Done", columnDone);

    $("#create_a_ticket").on("click", function(e) {
        e.preventDefault();

        var title = $("input[name='ticket_title']").val();
        var description = $("input[name='ticket_description']").val();

        if (title.length != 0 && description != 0) {
            createATicket(title, description, columnToDo, ticketRender);
        } else {
            errorMsg = "Please enter title and description.";
        }
        $("#errorMsg").text(errorMsg);
    });

    $("#move_ticket").on("click", function(event) {
        event.preventDefault();
        var ticketTitle = $("input[name='ticket_title']").val();
        var columnTitle = $("input[name='column_title']").val();
        moveTicket(ticketTitle, columnTitle, ticketRender);
        $("#errorMsg").text(errorMsg);
    });

    $("#delete_ticket").on("click", function(event) {
        event.preventDefault();
        var ticketTitle = $("input[name='ticket_title']").val();
        deleteTicket(ticketTitle, ticketRender);
        $("#errorMsg").text(errorMsg);
    });

});
