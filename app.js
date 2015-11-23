$(function() {

    var newBoard = new Board("Kanban", 4);
    var errorMsg;

    var columnToDo = new Column("To Do", 5);
    var columnInProgress = new Column("In Progress", 5);
    var columnReview = new Column("Review", 5);
    var columnDone = new Column("Done", 5);

    var localStorageKanban = new LocalStore();

    var columns = [columnToDo, columnInProgress, columnReview, columnDone];

    for (var i = 0; i < columns.length; i++) {
        newBoard.addOneColumnsToBoard(columns[i]);
    }

    var retrieveTicketsToDo = localStorageKanban.retrieveData("To_Do");
    var retrieveTicketsInProgress = localStorageKanban.retrieveData("In_Progress");
    var retrieveTicketsReview = localStorageKanban.retrieveData("Review");
    var retrieveTicketsDone = localStorageKanban.retrieveData("Done");

    function dataReRender(itemName, column) {
        localStorageKanban.updateStorage( itemName, column.showAllTicket() );
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
            $("#errorMsg").text(errorMsg).fadeIn(200);
        };

        this.drop = function(event, moveTicketFunc, ticketRenderFunc) {
            event.preventDefault();
            var $target = $(event.target);
            var destinationColumnTitle = $target.siblings("header").find("span").text();
            moveTicketFunc(draggedTicketTitle, destinationColumnTitle, ticketRenderFunc);
            $("#errorMsg").text(errorMsg).fadeIn(200);
        };

        this.bin = function(event, deleteTicketFunc, ticketRenderFunc) {
            deleteTicketFunc(draggedTicketTitle, ticketRenderFunc);
            $("#errorMsg").text(errorMsg).fadeIn(200);
        };
    };

    var bgImgAction = new function() {

        this.imgDropAndDisplay = function(event) {
            event.preventDefault(); // Cancel the default browser action.
            var file = event.dataTransfer.files[0];
            var reader = new FileReader();

            if (file) {
                reader.readAsDataURL(file);
                reader.onload = loaded;

                //for video
                /*reader.onload = function(event) {
                     $("video").attr("src", "videos/"+file.name );
                     console.log(event.target);
                 }*/
            }
        };

        this.imgSelectAndDisplay= function(event) { //ref: http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-selecting-files-dnd
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = loaded;

        };

        function loaded(event) {
            var dataURL = event.target.result;
            document.getElementsByClassName("board")[0].style.backgroundImage = "url('"+ dataURL +"')";

            localStorageKanban.updateStorage("bgImgURL", dataURL);
        }
    };

    /*function handleEvent(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = loaded;
    }*/

    /*function loaded(event) {
        var dataURL = event.target.result;
        document.getElementsByClassName("board")[0].style.backgroundImage = "url('"+ dataURL +"')";

        *//*localStorageKanban.updateStorage("bgImgURL", dataURL);
         console.log(dataURL);
         console.log(event.target);*//*
    }*/

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

    function createATicket(ticketTitle, ticketDescription, destinationColumn, ticketRenderFunc) {

        var ticketExists = newBoard.checkIfATicketExistOnBoard(ticketTitle);
        var reachedWipOrNot = destinationColumn.reachedWipOrNot();
        if (!reachedWipOrNot) {
            if (!ticketExists) {
                var newTicket = new Ticket(ticketTitle, ticketDescription);
                destinationColumn.addOneTicket(newTicket);
                var newSimpleTicket = newTicket.toSimpleTicket();

                //localStorage
                retrieveTicketsToDo = localStorageKanban.retrieveData("To_Do");
                console.log(retrieveTicketsToDo);
                /*if (retrieveTicketsToDo === null) {
                    localStorageKanban.updateStorage("To_Do", destinationColumn.getAllSimpleTickets() );
                    retrieveTicketsToDo = localStorageKanban.retrieveData("To_Do");
                }*/
                console.log(retrieveTicketsToDo);
                localStorageKanban.addToArray(retrieveTicketsToDo, newSimpleTicket);
                localStorageKanban.updateStorage("To_Do", retrieveTicketsToDo);
                //localStorage

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
                    ///Origin
                    var columnNameForLocalStorageOrigin = columnOrigin.getTitle().replace(/ /g, '_');
                    ////retrieve
                    var retrieveDataO = localStorageKanban.retrieveData(columnNameForLocalStorageOrigin);
                    ////remove
                    localStorageKanban.removeDataInArray(retrieveDataO, ticketTitle);
                    ////update
                    localStorageKanban.updateStorage(columnNameForLocalStorageOrigin, retrieveDataO);

                    ///Found
                    var columnNameForLocalStorageFound = columnFound.getTitle().replace(/ /g, '_');
                    ////retrieve
                    var retrieveDataF = localStorageKanban.retrieveData(columnNameForLocalStorageFound);
                    ////add
                    localStorageKanban.addToArray(retrieveDataF, newSimpleTicket);
                    ////update
                    localStorageKanban.updateStorage(columnNameForLocalStorageFound, retrieveDataF);
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
                ///retrieve
                var retrieveDataO = localStorageKanban.retrieveData(columnNameForLocalStorageOrigin);
                ///remove
                localStorageKanban.removeDataInArray(retrieveDataO, ticketTitle);
                ////update
                localStorageKanban.updateStorage(columnNameForLocalStorageOrigin, retrieveDataO);
                //localStorage

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
        $("#errorMsg").text(errorMsg).fadeIn(200);
    });

    $("#move_ticket").on("click", function(event) {
        event.preventDefault();
        var ticketTitle = $("input[name='ticket_title']").val();
        var columnTitle = $("input[name='column_title']").val();
        moveTicket(ticketTitle, columnTitle, ticketRender);
        $("#errorMsg").text(errorMsg).fadeIn(200);
    });

    $("#delete_ticket").on("click", function(event) {
        event.preventDefault();
        var ticketTitle = $("input[name='ticket_title']").val();
        deleteTicket(ticketTitle, ticketRender);
        $("#errorMsg").text(errorMsg).fadeIn(200);
    });

    $("#clear_ticket").on("click", function(event) {
        event.preventDefault();

        for (var i = 0; i < columns.length; i++) {
             columns[i].removeAllTickets();
             ticketRender(columns[i]);
        }

        localStorageKanban.deleteStorageItem("To_Do");
        localStorageKanban.deleteStorageItem("In_Progress");
        localStorageKanban.deleteStorageItem("Review");
        localStorageKanban.deleteStorageItem("Done");

        dataReRender("To_Do", columnToDo);
        dataReRender("In_Progress", columnInProgress);
        dataReRender("Review", columnReview);
        dataReRender( "Done", columnDone);
    });

    $("#dltBgImg").on("click", function() {
        localStorageKanban.deleteStorageItem("bgImgURL");
        document.getElementsByClassName("board")[0].style.backgroundImage = "none";
    });

    $("#selectFiles").on("change", bgImgAction.imgSelectAndDisplay);

    //bin
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

});
