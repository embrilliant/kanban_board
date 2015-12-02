$(function() {

    var newBoard = new Board("Kanban", 4);
    //var errorMsg;

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    var localStorageKanban = new LocalStore();
    var storageHandle = new LocalStorageHandle(localStorageKanban);

    var bgImgAction = new BgImgAction( localStorageKanban );

    var columns = [columnToDo, columnInProgress, columnReview, columnDone];

    var storageItemNames = ["To_Do", "In_Progress", "Review", "Done"];

    var retrievedDataArrays = [localStorageKanban.retrieveData(storageItemNames[0]), localStorageKanban.retrieveData(storageItemNames[1]), localStorageKanban.retrieveData(storageItemNames[2]), localStorageKanban.retrieveData(storageItemNames[3])];

    for (var i = 0; i < columns.length; i++) {
        newBoard.addOneColumnsToBoard(columns[i]);
    }

    function initRetrievedDataRender(retrievedData, itemName, column) {

        if (retrievedData === null) {
            localStorageKanban.updateStorage( itemName, column.showAllTicket() );
            retrievedData = localStorageKanban.retrieveData(itemName);
        }

        for (var i = 0; i < retrievedData.length; i++ ) {
            var title = retrievedData[i].title;
            var description = retrievedData[i].description;
            var newTicket = new Ticket(title, description);
            column.addOneTicket(newTicket);
        }

        ticketRender(column);

        var bgImgURL = localStorageKanban.retrieveData("bgImgURL");
        if (bgImgURL) {
            document.getElementsByClassName("board")[0].style.backgroundImage = "url('"+ bgImgURL +"')";
        }
    }

    function boardRender() {
        var boardName = newBoard.getBoardName();
        var cssClass = newBoard.constructor.name.toLowerCase();
        var $newDiv = $('<div/>',{ id: boardName, "class": cssClass});
        $("#board_container").append($newDiv);
        var theBoard = $newDiv.get(0);
        theBoard.addEventListener("drop", bgImgAction.imgDropAndDisplay, false);
        theBoard.addEventListener("dragover", dAndD.allowDrop);
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

    function createATicket(ticketTitle, ticketDescription, destinationColumn, ticketRenderFunc) {
        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        var reachedWipOrNot = destinationColumn.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket(ticketTitle, ticketDescription);
                destinationColumn.addOneTicket(newTicket);
                var newSimpleTicket = newTicket.toSimpleTicket();

                //localStorage
                storageHandle.addDataAndUpdate(newSimpleTicket, columns[0]);

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
                    ///Origin
                    storageHandle.removeDataAndUpdate(ticketTitle, columnOrigin);

                    ///Found
                    storageHandle.addDataAndUpdate(newSimpleTicket, columnFound);

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

                storageHandle.removeDataAndUpdate(ticketTitle, columnOrigin);

                animatedBin();
            } else {
                errorMsg = "Ticket can only be deleted from Done.";
                console.log("Ticket can only be deleted from Done.");
            }
        } else {
            errorMsg = "Ticket not found.";
            console.log("Ticket not found.");
        }
    }

    function userTicket() {
        var ticket = new Ticket();

        ticket.setTitle( $("input[name='ticket_title']").val() );
        ticket.setDescription( $("input[name='ticket_description']").val() );

        return ticket;
    }

    function userColumn() {
        var column = new Column();

        column.setTitle( $("input[name='column_title']").val() );

        return column;
    }

    boardRender();
    columnRender("Kanban");

    for (var s = 0; s < columns.length; s++) {
        initRetrievedDataRender(retrievedDataArrays[s], storageItemNames[s], columns[s]);
    }

    //////buttons
    $("#create_a_ticket").on("click", function(event) {
        event.preventDefault();
        if ( userTicket().getTitle().length != 0 && userTicket().getDescription().length != 0) {
            createATicket( userTicket().getTitle(), userTicket().getDescription(), columnToDo, ticketRender);
            $("input:text").val("");
        } else {
            errorMsg = "Please enter title and description.";
        }
        showErrorMsg();
    });

    $("#move_ticket").on("click", function(event) {
        event.preventDefault();
        moveTicket( userTicket().getTitle(), userColumn().getTitle(), ticketRender);
        showErrorMsg();
    });

    $("#delete_ticket").on("click", function(event) {
        event.preventDefault();
        deleteTicket( userTicket().getTitle(), ticketRender);
        showErrorMsg();
    });

    $("#clear_ticket").on("click", function(event) {
        event.preventDefault();

        for (var i = 0; i < columns.length; i++) {
            columns[i].removeAllTickets();
            ticketRender(columns[i]);

            storageHandle.storageItemClearAndUpdate(storageItemNames[i], columns[i] );
        }

    });

    $("#dltBgImg").on("click", function() {
        localStorageKanban.deleteStorageItem("bgImgURL");
        document.getElementsByClassName("board")[0].style.backgroundImage = "none";
    });

    $("#selectFiles").on("change", bgImgAction.imgSelectAndDisplay);

    ///////interactive bin
    document.getElementById("bin").addEventListener("dragover", dAndD.allowDrop, false);
    document.getElementById("bin").addEventListener("drop", function() {
        dAndD.bin(event, deleteTicket, ticketRender);
    }, false);

    function animatedBin() {
        var $bin = $( document.getElementById("icon_bin") );

        setTimeout(function(){
            $bin.css({
                "transform": "rotate(-30deg)"
            });
        }, 0);
        setTimeout(function(){
            $bin.css({
                "transform": "rotate(20deg)"
            });
        }, 100);
        setTimeout(function(){
            $bin.css({
                "transform": "rotate(-20deg)"
            });
        }, 200);
        setTimeout(function(){
            $bin.css({
                "transform": "rotate(20deg)"
            });
        }, 300);
        setTimeout(function(){
            $bin.css({
                "transform": "none"
            });
        }, 400);
    }

    //////console logs
    console.log(localStorageKanban.retrieveData(storageItemNames[0]));
    console.log(localStorageKanban.retrieveData(storageItemNames[1]));
    console.log(localStorageKanban.retrieveData(storageItemNames[2]));
    console.log(localStorageKanban.retrieveData(storageItemNames[3]));

});