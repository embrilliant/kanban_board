
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