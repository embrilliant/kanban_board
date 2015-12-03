
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
