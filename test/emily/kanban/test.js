// Ticket tests
suite("Ticket object", function() {
    test("there should be ticket objects", function() {
        var newTicket = new Ticket();
        newTicket.should.be.a("object");
    });
});

suite("Ticket object with Title", function() {
    test("ticket objects should have titles", function() {
        var newTicket = new Ticket("Title");
        var title = newTicket.getTitle();
        assert("Title", title);
    });
});

suite("Ticket object with description", function() {
    test("a ticket object should have a description", function() {
        var newTicket = new Ticket("Title", "Description");
        var description = newTicket.getDescription();
        assert("Description", description);
    });
});

suite("Create a ticket with Title and Description", function() {
    test("A Ticket should be created", function() {
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticketTitle = ticket1.getTitle();
        var ticketDes = ticket1.getDescription();
        ticket1.should.be.a("object");
        assert.equal(ticketTitle, "Task 1");
        assert.equal(ticketDes, "This task should be done first.");
    });
});

// Column tests
suite("Column object ", function() {
    test("there should be Column objects", function() {
        var newColumn = new Column();
        newColumn.should.be.a("object");
    });
});

suite("Create a column", function() {
    test("A Column should be created with Title and Wip number", function() {
        var columnToDo = new Column("To Do", 5);
        var colTitle = columnToDo.getTitle();
        var colWip = columnToDo.getWipNumber();
        columnToDo.should.be.a("object");
        assert.equal(colTitle, "To Do");
        assert.equal(colWip, 5);
    });
});

suite("Column containing tickets", function() {
    test("there should be an array of Tickets in the Column", function() {
        var newColumn = new Column("To Do", 5);
        var array = newColumn.showAllTicket();
        assert.isArray(array);
    });
});

suite("Column Adding tickets", function() {
    test("method to add a ticket", function() {
        var newColumn = new Column("To Do", 5);
        newColumn.addOneTicket();
        var array = newColumn.showAllTicket();
        assert.lengthOf(array, 1);
    });
});

suite("Add a ticket to Column", function() {
    test("One ticket should be added to the Column", function() {
        var columnToDo = new Column("To Do", 5);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        columnToDo.addOneTicket(ticket1);
        var arrayOfTickets = columnToDo.showAllTicket();
        assert.lengthOf(arrayOfTickets, 1);
        assert.deepEqual(arrayOfTickets[0], ticket1);
    });
});

suite("Add another ticket to the Column", function() {
    test("Another ticket should be added to the Column", function() {
        var columnToDo = new Column("To Do", 5);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        var arrayOfTickets = columnToDo.showAllTicket();
        assert.lengthOf(arrayOfTickets, 2);
        assert.deepEqual(arrayOfTickets[1], ticket2);
    });
});

suite("Find a certain Ticket in Column", function() {
    test("Column ticket array containing a certain ticket", function() {
        var newColumn = new Column("To Do", 5);
        var ticketArray = newColumn.showAllTicket();
        var title = "Do this task";
        var newTicket = new Ticket(title);
        newColumn.addOneTicket(newTicket);
        var found = ticketArray.filter(function(item) {
            return item.getTitle() === title;
        });
        assert.isNotNull(found);
        assert.lengthOf(ticketArray, 1);
    });
});

suite("Wip Number is the Max number of tickets in a Column", function() {
    test("Wip is the max Length of Array", function() {
        var columnToDo = new Column("To Do", 6);
        var columnInProgress = new Column("To Do", 2);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var ticket4 = new Ticket("Task 4", "No description.");
        var ticket5 = new Ticket("Task 5", "No description.");
        var ticket6 = new Ticket("Task 6", "No description.");
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.addOneTicket(ticket3);
        columnToDo.addOneTicket(ticket4);
        columnInProgress.addOneTicket(ticket5);
        columnInProgress.addOneTicket(ticket6);
        var reachedToDoWip = columnToDo.reachedWipOrNot();
        var reachedInProgressWip = columnInProgress.reachedWipOrNot();
        assert.isFalse(reachedToDoWip);
        assert.isTrue(reachedInProgressWip);
    });
});

suite("Remove one ticket by Title from the Column", function() {
    test("One ticket with the title should be removed from the Column", function() {
        var columnToDo = new Column("To Do", 5);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.removeTicketByTitle("Task 2");
        var arrayOfTickets = columnToDo.showAllTicket();
        assert.lengthOf(arrayOfTickets, 1);
        assert.deepEqual(arrayOfTickets, [ticket1]);
    });
});

suite("Remove another ticket by Title from the Column", function() {
    test("Again one ticket with the title should be removed from the Column", function() {
        var columnToDo = new Column("To Do", 5);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.removeTicketByTitle("Task 1");
        columnToDo.removeTicketByTitle("Task 2");
        var arrayOfTickets = columnToDo.showAllTicket();
        assert.lengthOf(arrayOfTickets, 0);
        assert.deepEqual(arrayOfTickets, []);
    });
});

suite("Find Ticket by Title in Column", function() {
    test("Find the ticket by its title", function() {
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var columnToDo = new Column("To Do", 5);
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.addOneTicket(ticket3);
        var ticketToBeFound = columnToDo.findTicketByTitle("Task 2");
        assert.deepEqual(ticketToBeFound, ticket2);
    });
});

suite("Find Ticket by Title in Column and then change Title and Description", function() {
    test("Find the ticket by its title and then change its title and description", function() {
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var columnToDo = new Column("To Do", 5);
        columnToDo.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.addOneTicket(ticket3);
        var ticketFound = columnToDo.findTicketByTitle("Task 2");
        ticketFound.setTitle("New Title");
        ticketFound.setDescription("New Description.");
        assert.equal(ticketFound.getTitle(), "New Title");
        assert.equal(ticketFound.getDescription(), "New Description.");
    });
});

suite("Column by Title", function() {
    test("Find the Column by its title", function() {
        var newBoard = new Board("Kanban", 4);
        var columnToDo = new Column("To Do", 3);
        var columnInProgress = new Column("In Progress", 3);
        var columnReview = new Column("Review", 3);
        var columnDone = new Column("Done", 3);
        newBoard.addOneColumnsToBoard(columnToDo);
        newBoard.addOneColumnsToBoard(columnInProgress);
        newBoard.addOneColumnsToBoard(columnReview);
        newBoard.addOneColumnsToBoard(columnDone);
        var columnToBeFound = newBoard.findColumnByTitle("In Progress");
        assert.deepEqual(columnToBeFound, columnInProgress);
    });
});

suite("Check if ticket by title already exits in Column", function() {
    test("Check if ticket by title already exits on the whole Board", function() {
        var newBoard = new Board("Kanban", 4);
        var columnInProgress = new Column("In Progress", 4);
        newBoard.addOneColumnsToBoard(columnInProgress);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var ticket4 = new Ticket("Task 4", "Description.");
        columnInProgress.addOneTicket(ticket1);
        columnInProgress.addOneTicket(ticket2);
        columnInProgress.addOneTicket(ticket3);
        columnInProgress.addOneTicket(ticket4);
        var ticketExists = newBoard.checkIfATicketExistOnBoard("Task 5");
        assert.notOk(ticketExists);
    });
});

// Board test
suite("Board object", function() {
   test("there should be a Board object", function() {
       var newBoard = new Board();
       newBoard.should.be.a("object");
   });
});

suite("Create a Board", function() {
    test("A board with a name should be created", function() {
        var newBoard = new Board("Kanban", 4);
        var boardName = newBoard.getBoardName();
        assert.isObject(newBoard);
        assert.equal(boardName, "Kanban");
    });
});

suite("Add Columns to Board", function() {
    test("New columnws should be added to the Board", function() {
        var newBoard = new Board("Kanban", 4);
        var columnToDo = new Column("To Do", 5);
        var columnInProgress = new Column("In Progress", 5);
        newBoard.addOneColumnsToBoard(columnToDo);
        newBoard.addOneColumnsToBoard(columnInProgress);
        assert.lengthOf(newBoard.getAllColumns(), 2);
        assert.deepEqual(newBoard.getAllColumns(), [columnToDo, columnInProgress]);
    });
});

suite("Remove Columns by title from Board", function() {
    test("Columns should be removed by title from the Board", function() {
        var newBoard = new Board("Kanban", 4);
        var columnToDo = new Column("To Do", 5);
        var columnInProgress = new Column("In Progress", 5);
        newBoard.addOneColumnsToBoard(columnToDo);
        newBoard.addOneColumnsToBoard(columnInProgress);
        assert.lengthOf(newBoard.getAllColumns(), 2);
        assert.deepEqual(newBoard.getAllColumns(), [columnToDo, columnInProgress]);
        newBoard.removeOneColumnByTitle("To Do");
        assert.deepEqual(newBoard.getAllColumns(), [columnInProgress]);
        assert.lengthOf(newBoard.getAllColumns(), 1);
    });
});

suite("Find column by ticket Title in Board", function() {
    test("Find the column ticket by Title among in Board", function() {
        var newBoard = new Board("Kanban", 4);
        var columnToDo = new Column("To Do", 3);
        var columnInProgress = new Column("In Progress", 3);
        newBoard.addOneColumnsToBoard(columnToDo);
        newBoard.addOneColumnsToBoard(columnInProgress);
        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var ticket4 = new Ticket("Task 4", "Description.");
        columnToDo.addOneTicket(ticket2);
        columnToDo.addOneTicket(ticket3);
        columnInProgress.addOneTicket(ticket1);
        columnInProgress.addOneTicket(ticket4);
        var columnFound = newBoard.findColumnByTicketTitle(ticket1.getTitle());
        assert.deepEqual(columnFound, columnInProgress);
    });
});

// Integration
suite("Check if ticket by title already exits in the whole Board before adding a new ticket to Column", function() {
    test("Add a new ticket if ticket by title doesn't exits on the whole Board", function() {
        var newBoard = new Board("Kanban", 4);

        var columnToDo = new Column("To Do", 5);
        var columnInProgress = new Column("In Progress", 5);
        var columnReview = new Column("Review", 5);
        var columnDone = new Column("Done", 5);

        newBoard.addOneColumnsToBoard(columnToDo);
        newBoard.addOneColumnsToBoard(columnInProgress);
        newBoard.addOneColumnsToBoard(columnReview);
        newBoard.addOneColumnsToBoard(columnDone);

        var ticket1 = new Ticket("Task 1", "This task should be done first.");
        var ticket2 = new Ticket("Task 2", "This task should be done after the first one.");
        var ticket3 = new Ticket("Task 3", "It should be done at some point.");
        var ticket4 = new Ticket("Task 4", "Description.");
        var ticket5 = new Ticket("Task 5", "Description.");

        columnInProgress.addOneTicket(ticket1);
        columnToDo.addOneTicket(ticket2);
        columnToDo.addOneTicket(ticket3);
        columnToDo.addOneTicket(ticket4);

        var ticketExists = newBoard.checkIfATicketExistOnBoard("Task 5");
        if (!ticketExists) {
            columnToDo.addOneTicket(ticket5);
        }
        assert.equal(columnToDo.getTicketCount(), 4);
    });
});