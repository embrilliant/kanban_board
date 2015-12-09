
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