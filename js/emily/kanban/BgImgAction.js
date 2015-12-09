
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
