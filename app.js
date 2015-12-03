$(function() {

    var newBoard = new Board("Kanban", 4);
    //var errorMsg;

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    var localStorageKanban = new LocalStore();
    var storageHandle = new LocalStorageHandle(localStorageKanban);

    var dAndD = new DAndD();
    var bgImgAction = new BgImgAction( localStorageKanban );

    var ticketHandler = new TicketHandler(newBoard, ticketRender, storageHandle);

    var animatedBin = new Anime( $( document.getElementById("icon_bin") ) );

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
                dAndD.drop(event, ticketHandler.moveTicket);
                showErrorMsg();
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

            ticketHandler.createATicket( userTicket(), columnToDo );
            $("input:text").val("");
        } else {
            errorMsg = "Please enter title and description.";
        }
        showErrorMsg();
    });

    $("#move_ticket").on("click", function(event) {
        event.preventDefault();

        ticketHandler.moveTicket( userTicket(), userColumn() );
        showErrorMsg();
    });

    $("#delete_ticket").on("click", function(event) {
        event.preventDefault();

        ticketHandler.deleteTicket( userTicket(), columnDone, animatedBin );
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

    $("#selectFiles").on("change", bgImgAction.imgSelectAndDisplay);

    $("#dltBgImg").on("click", function() {
        document.getElementsByClassName("board")[0].style.backgroundImage = "none";
        $("#selectFiles").val("");
        localStorageKanban.deleteStorageItem("bgImgURL");
    });

    ///////interactive bin
    document.getElementById("bin").addEventListener("dragover", dAndD.allowDrop, false);
    document.getElementById("bin").addEventListener("drop", function() {
        dAndD.bin(event, columnDone, ticketHandler.deleteTicket, animatedBin);
        showErrorMsg();
    }, false);

    //////console logs
    console.log(localStorageKanban.retrieveData(storageItemNames[0]));
    console.log(localStorageKanban.retrieveData(storageItemNames[1]));
    console.log(localStorageKanban.retrieveData(storageItemNames[2]));
    console.log(localStorageKanban.retrieveData(storageItemNames[3]));

});