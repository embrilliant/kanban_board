$(function() {

    var newBoard = new Board("Kanban", 4);

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    var localStorageKanban = new LocalStore();
    var storageHandle = new LocalStorageHandle(localStorageKanban);

    var dAndD = new DAndD();
    var bgImgAction = new BgImgAction( localStorageKanban );

    var errorMsg = new ErrorMsg();

    var render = new Render( dAndD );
    var ticketHandler = new TicketHandler(newBoard, render, storageHandle, errorMsg);

    var animatedBin = new Anime( $( document.getElementById("icon_bin") ) );

    var columns = [columnToDo, columnInProgress, columnReview, columnDone];
    var storageItemNames = ["To_Do", "In_Progress", "Review", "Done"];
    var retrievedDataArrays = [localStorageKanban.retrieveData(storageItemNames[0]), localStorageKanban.retrieveData(storageItemNames[1]), localStorageKanban.retrieveData(storageItemNames[2]), localStorageKanban.retrieveData(storageItemNames[3])];

    for (var i = 0; i < columns.length; i++) {
        newBoard.addOneColumnsToBoard(columns[i]);
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

    render.board(newBoard, bgImgAction);
    render.column(newBoard,ticketHandler, errorMsg);

    for (var s = 0; s < columns.length; s++) {
        render.initialRetrievedData( retrievedDataArrays[s], storageItemNames[s], columns[s], localStorageKanban );
    }

    //////buttons
    $("#create_a_ticket").on("click", function(event) {
        event.preventDefault();
        if ( userTicket().getTitle().length != 0 && userTicket().getDescription().length != 0) {
            ticketHandler.createATicket( userTicket(), columnToDo );
            $("input:text").val("");
        } else {
            errorMsg.setMsg("Please enter title and description.");
        }
        errorMsg.showErrorMsg();
    });

    $("#move_ticket").on("click", function(event) {
        event.preventDefault();
        ticketHandler.moveTicket( userTicket(), userColumn() );
        errorMsg.showErrorMsg();
    });

    $("#delete_ticket").on("click", function(event) {
        event.preventDefault();
        ticketHandler.deleteTicket( userTicket(), columnDone, animatedBin );
        errorMsg.showErrorMsg();
    });

    $("#clear_ticket").on("click", function(event) {
        event.preventDefault();
        for (var i = 0; i < columns.length; i++) {
            columns[i].removeAllTickets();
            render.ticket(columns[i]);
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
        errorMsg.showErrorMsg();
    }, false);

    //////console logs
    console.log(localStorageKanban.retrieveData(storageItemNames[0]));
    console.log(localStorageKanban.retrieveData(storageItemNames[1]));
    console.log(localStorageKanban.retrieveData(storageItemNames[2]));
    console.log(localStorageKanban.retrieveData(storageItemNames[3]));

});