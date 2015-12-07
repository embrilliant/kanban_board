
function ErrorMsg() {

    var msg;

    this.setMsg = function(errMsgStr) {
        msg = errMsgStr;
    };

    this.showErrorMsg = function() {
        $("#errorMsg").text(msg).fadeIn(200);
    };
}