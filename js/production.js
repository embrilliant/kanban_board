
function Anime( jQueryElementToBeAnimated ) {

    var $element = jQueryElementToBeAnimated;
    //var $bin = $( document.getElementById("icon_bin") );

    this.startAnimate = function() {

        setTimeout(function(){
            $element.css({
                "transform": "rotate(-30deg)"
            });
        }, 0);
        setTimeout(function(){
            $element.css({
                "transform": "rotate(20deg)"
            });
        }, 100);
        setTimeout(function(){
            $element.css({
                "transform": "rotate(-20deg)"
            });
        }, 200);
        setTimeout(function(){
            $element.css({
                "transform": "rotate(20deg)"
            });
        }, 300);
        setTimeout(function(){
            $element.css({
                "transform": "none"
            });
        }, 400);
    }
}


function BgImgAction( storageObject) {

    function loaded(event) {
        var dataURL = event.target.result;
        document.getElementsByClassName("board")[0].style.backgroundImage = "url('"+ dataURL +"')";

        if ( storageObject ) {
            storageObject.updateStorage("bgImgURL", dataURL);
        }
    }

    this.imgDropAndDisplay = function(event) {
        event.preventDefault(); // Cancel the default browser action.
        var file = event.dataTransfer.files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = loaded;
        }
    };

    this.imgSelectAndDisplay= function(event) { //inspiration ref: http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-selecting-files-dnd
        var file = event.target.files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = loaded;
        }
    };
}

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
                if  ( thisTicket.getTitle() === ticketTitle ) {
                    return true;
                }
            }
        }
    };

}

function Column(title, wip) {

    var columnTitle = title;
    var wipNum = wip;

    var arrayOfTickets = [];
    var arrayOfSimpleTickets = [];

    this.getTitle = function() {
        return columnTitle;
    };

    this.getWipNumber = function() {
        return wipNum;
    };

    this.setTitle = function(newTitle) {
        columnTitle = newTitle;
    };

    this.showAllTicket = function() {
        return arrayOfTickets;
    };

    this.getAllSimpleTickets = function() {
        return arrayOfSimpleTickets;
    };

    this.reachedWipOrNot = function() {
        if ( arrayOfTickets.length < wipNum ) {
            return false;
        } else {
            return true;
        }
    };

    this.reachedWipOrNotS = function() {
        if ( arrayOfSimpleTickets.length < wipNum ) {
            return false;
        } else {
            return true;
        }
    };

    this.addOneTicket = function(ticket) {
        arrayOfTickets.push(ticket);
    };

    this.addOneSimpleTicket = function(simpleTicket) {
        arrayOfSimpleTickets.push(simpleTicket);
    };

    this.setTicketsArrayS = function(newArray) {
        arrayOfSimpleTickets = newArray;
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

    this.removeAllTickets = function() {
        arrayOfTickets = [];
    };

    this.getTicketCount = function() {
        return arrayOfTickets.length;
    };

}



function DAndD() {

    var draggedTicketTitle;

    this.allowDrop = function(event) {
        event.preventDefault();
    };

    this.drag = function(event) {
        draggedTicketTitle = $(event.target).find("span").text();
    };

    this.drop = function(event, moveTicketFunc) {
        event.preventDefault();
        var file = event.dataTransfer.files[0];
        if (!file) {
            var $target = $(event.target);
            var destinationColumnTitle = $target.siblings("header").find("span").text();
            var ticket = new Ticket(draggedTicketTitle);
            var column = new Column(destinationColumnTitle);
            moveTicketFunc(ticket, column);
        }
    };

    this.bin = function(event, columnDoneObj, deleteTicketFunc, extraAnimationObj) {
        var ticket = new Ticket(draggedTicketTitle);
        deleteTicketFunc( ticket, columnDoneObj, extraAnimationObj);
    };
}

function ErrorMsg() {

    var msg;

    this.setMsg = function(errMsgStr) {
        msg = errMsgStr;
    };

    this.showErrorMsg = function() {
        $("#errorMsg").text(msg).fadeIn(200);
    };
}


function LocalStore() {

    this.retrieveData = function(itemName) {
        return JSON.parse( localStorage.getItem(itemName) );
    };

    this.updateStorage = function(itemName, dataArray) {
        localStorage.setItem(itemName, JSON.stringify( dataArray ) );
    };

    this.addToArray = function(retrievedData, simpleTicket) {
        retrievedData.push(simpleTicket);
    };

    this.removeDataInArray = function(dataArray, valueToCheck) {
        var index;
        for (var i=0; i < dataArray.length; i++) {
            if (dataArray[i].title === valueToCheck ) {
                index = i;
            }
        }
        dataArray.splice(index, 1);
    };

    this.deleteStorageItem = function(itemName) {
        localStorage.removeItem(itemName);
    };
}

function LocalStorageHandle(LocalStoreObject) {

    this.addDataAndUpdate = function(simpleTicket, column) {

        var columnNameForLocalStorage = column.getTitle().replace(/ /g, '_');

        ////retrieve data
        var retrieveDataArray = LocalStoreObject.retrieveData(columnNameForLocalStorage);

        ////add
        LocalStoreObject.addToArray(retrieveDataArray, simpleTicket);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorage, retrieveDataArray);
    };

    this.removeDataAndUpdate = function(ticketTitle, column) {

        ///Origin
        var columnNameForLocalStorageOrigin = column.getTitle().replace(/ /g, '_');
        ////retrieve
        var retrievedData = LocalStoreObject.retrieveData(columnNameForLocalStorageOrigin);

        ///remove
        LocalStoreObject.removeDataInArray(retrievedData, ticketTitle);
        ////update
        LocalStoreObject.updateStorage(columnNameForLocalStorageOrigin, retrievedData);
    };

    this.storageItemClearAndUpdate = function(itemName, column) {
        LocalStoreObject.deleteStorageItem(itemName);
        LocalStoreObject.updateStorage( itemName, column.showAllTicket() );
    };

}


function Render( dAndDObj ) {

    var that = this;

    this.board = function( boardObj, bgImgActObj) {
        var boardName = boardObj.getBoardName();
        var cssClass = boardObj.constructor.name.toLowerCase();
        var $newDiv = $('<div/>',{ id: boardName, "class": cssClass});
        $("#board_container").append($newDiv);
        var theBoard = $newDiv.get(0);
        theBoard.addEventListener("drop", bgImgActObj.imgDropAndDisplay, false);
        theBoard.addEventListener("dragover", dAndDObj.allowDrop);
    };

    this.column = function( boardObj, ticketHandlerObj, errorMsgObj ) {
        var arrayOfColumns = boardObj.getAllColumns();
        for (var i = 0; i < boardObj.getColumnCount(); i++) {
            var columnTitle = arrayOfColumns[i].getTitle();
            var divId = columnTitle.replace(/ /g,'_');
            var cssClass = arrayOfColumns[i].constructor.name.toLowerCase();
            var $newDiv = $('<div/>',{ id: divId, "class": cssClass});
            $newDiv.append("<header><span>"+ columnTitle +"</span> ("+ arrayOfColumns[i].getWipNumber() +") </header><section></section>");
            $("#" + boardObj.getBoardName() ).append($newDiv);
            //find child element javascript
            var theColumn = $newDiv.get(0);
            theColumn.getElementsByTagName("section")[0].addEventListener("dragover", dAndDObj.allowDrop, false);
            theColumn.getElementsByTagName("section")[0].addEventListener("drop", function() {
                dAndDObj.drop(event, ticketHandlerObj.moveTicket);
                errorMsgObj.showErrorMsg();
            }, false);
        }
    };

    this.ticket = function( columnObj ) {
        var whichColumn = columnObj.getTitle().replace(/ /g, '_');
        var $board = $("#" + whichColumn);
        $board.find("section").html("");
        var arrayOfTickets = columnObj.showAllTicket();
        if ( arrayOfTickets.length > 0 ) {
            for (var i = 0; i < columnObj.getTicketCount(); i++) {
                var ticketTitle = arrayOfTickets[i].getTitle();
                var ticketDescription = arrayOfTickets[i].getDescription();
                var cssClass = arrayOfTickets[i].constructor.name.toLowerCase();
                var $newDiv = $('<div/>', {"class": cssClass,
                    "draggable": "true"
                });
                $newDiv.html("Title: <span>"+ ticketTitle +"</span><br>Description: "+ ticketDescription);
                $board.find("section").append($newDiv);
                var newDiv = $newDiv.get(0);
                newDiv.addEventListener("dragstart", dAndDObj.drag, false);
            }
        }
    };

    this.initialRetrievedData = function( retrievedData, storageItemName, columnObj, localStorageObj ) {
        if (retrievedData === null) {
            localStorageObj.updateStorage( storageItemName, columnObj.showAllTicket() );
            retrievedData = localStorageObj.retrieveData( storageItemName );
        }

        for (var i = 0; i < retrievedData.length; i++ ) {
            var title = retrievedData[i].title;
            var description = retrievedData[i].description;
            var newTicket = new Ticket(title, description);
            columnObj.addOneTicket(newTicket);
        }

        that.ticket( columnObj );

        var bgImgURL = localStorageObj.retrieveData("bgImgURL");
        if (bgImgURL) {
            document.getElementsByClassName("board")[0].style.backgroundImage = "url('"+ bgImgURL +"')";
        }
    };
}

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
}



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