
function DAndD() {

    var draggedTicketTitle;

    this.allowDrop = function(event) {
        event.preventDefault();
    };

    this.drag = function(event) {
        draggedTicketTitle = $(event.target).find("span").text();
    };

    this.drop = function(event, moveTicketFunc, ticketRenderFunc) {
        event.preventDefault();
        var file = event.dataTransfer.files[0];
        if (!file) {
            var $target = $(event.target);
            var destinationColumnTitle = $target.siblings("header").find("span").text();
            moveTicketFunc(draggedTicketTitle, destinationColumnTitle, ticketRenderFunc);
            //showErrorMsg();
        }
    };

    this.bin = function(event, deleteTicketFunc, ticketRenderFunc) {
        deleteTicketFunc(draggedTicketTitle, ticketRenderFunc);
        //showErrorMsg();
    };
}