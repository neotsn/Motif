/**
 * Sample actions execution file
 */

(function ( window, document, Motif, undefined ) {

    "use strict";

    var App = function () {
        this.initUI();
        this.initForms();
    };

    App.prototype.initUI = function () {
        var bgs = new Motif.apps.BackgroundCover("[data-img]");
        $("[data-lazy-img]").plugin("lazyImage");
        $(".js-modal__full").plugin("modal", {
            "modalClass": "modal--full-page"
        });
        $(".js-modal__box").plugin("modal", {
            "modalClass": "modal--box"
        });
        // $(".canvas-trigger").plugin("reveal", {
        //     "type": "exclusive",
        //     "activeClass": "is-active",
        //     "visitedClass": "was-active"
        // });
        // $(".js-reveal").plugin("reveal", {
        //     "type": "exclusive",
        //     "activeClass": "is-revealed",
        //     "visitedClass": "was-revealed"
        // });
        // $(".js-fade").plugin("reveal", {
        //     "activeClass": "is-faded",
        //     "visitedClass": "was-faded"
        // });
        // $(".js-expand").plugin("reveal", {
        //     "type": "exclusive",
        //     "activeClass": "is-expanded",
        //     "visitedClass": "was-expanded"
        // });
    };

    App.prototype.initForms = function () {
        // $("[data-validation='ajax']").plugin("ajaxSubmission");
        // $("[data-validation='true']").plugin("gauntlet");
    };

    new App();

}( window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );
