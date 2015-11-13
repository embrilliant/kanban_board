
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

    //this.fromJSON()
}

