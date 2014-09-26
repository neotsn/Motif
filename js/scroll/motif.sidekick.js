/*!
 * Motif Sidekick v0.1.0
 * A basic sticky sidebar built on Motif Herald
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, LB, undefined ) {

    "use strict";

    var Sidekick = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    Sidekick.counter = 0;

    Sidekick.prototype = {
        "defaults": {
            "context": false,
            "stickyClass": "is-sticky",
            "stuckClass": "was-sticky",
            "topOffset": null,
            "bottomOffset": null,
            "keepWidth": true,
            "minWidth": false,
            "window": $( window ),
            "useParentWidth": false
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            this.bindEvents.call( this );
            this.buildEvents.call( this );
            this.initHerald.call( this );
            Sidekick.counter += 1;

            return this;
        },

            "initVars": function ( userOptions ) {
                this.config = userOptions;
                this.metadata = this.$elem.data("sidekick-options");
                this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

                if ( this.options.context ) {
                    this.$context = this.options.context;
                } else {
                    this.$context = this.$elem.parent();
                }

                this.identity = this.$elem.attr("id") || "sidekick-" + Sidekick.counter;
                this.$window = this.options.window;
                this.heraldEvents = [];
            },

            "bindEvents": function () {
                var self = this;

                $document.on("sidekick/" + self.identity + "/top", function onStickyTop ( event, dir, herald ) {
                    self.topEvent.call( self, dir, herald );
                });

                $document.on("sidekick/" + self.identity + "/bottom", function onStickyBottom ( event, dir, herald ) {
                    self.bottomEvent.call( self, dir, herald );
                });
            },

            "buildEvents": function () {
                var self = this,
                    topObject = {
                        "trigger": function () {
                            return self.getTopPosition.call( self );
                        },
                        "event": function ( dir ) {
                            $document.trigger( "sidekick/" + self.identity + "/top", [ dir, this ] );
                        },
                        "repeat": true
                    },
                    bottomObject = {
                        "trigger": function () {
                            return self.getBottomPosition.call( self );
                        },
                        "event": function ( dir ) {
                            $document.trigger( "sidekick/" + self.identity + "/bottom", [ dir, this ] );
                        },
                        "repeat": true
                    };

                self.heraldEvents.push( topObject, bottomObject );

                return self.heraldEvents;
            },

                "getTopPosition": function () {
                    if ( typeof this.options.topOffset === "function" ) {
                        return this.options.topOffset.call( this );
                    } else {
                        return this.$context.offset().top;
                    }
                },

                "topEvent": function ( dir, herald ) {

                    var sideWidth = this.options.keepWidth ? this.$elem.outerWidth() : false,
                        leftOffset = this.$elem.offset().left;

                    if ( this.options.minWidth && this.$window.width() >= this.options.minWidth ) {
                        if ( dir === "down" ) {
                            this.stick.call( this, sideWidth, leftOffset, this.options.useParentWidth );
                        } else if ( dir === "up" ) {
                            this.unstick.call( this );
                        }
                    } else {
                        this.unstick.call( this );
                    }
                },

                "getBottomPosition": function () {
                    if ( typeof this.options.bottomOffset === "function" ) {
                        return this.options.bottomOffset.call( this );
                    } else {
                        return this.$context.offset().top + this.$context.outerHeight() - this.$elem.outerHeight();
                    }
                },

                "bottomEvent": function ( dir, herald ) {

                    var sideWidth = this.options.keepWidth ? this.$elem.outerWidth() : false,
                        leftOffset = this.$elem.offset().left,
                        topIsTriggered;

                    if ( this.options.minWidth && this.$window.width() >= this.options.minWidth ) {
                        if ( dir === "up" ) {
                            topIsTriggered = herald.testTrigger.call( herald, this.getTopPosition() );
                            if ( !topIsTriggered ) {
                                this.stick.call( this, sideWidth, leftOffset, this.options.useParentWidth );
                            }
                        } else if ( dir === "down" ) {
                            this.stuck.call( this );
                        }
                    } else {
                        this.unstick.call( this );
                    }
                },

                    "stick": function ( sideWidth, leftOffset, useParentWidth ) {
                        if ( sideWidth ) {
                            this.$elem.outerWidth( sideWidth );
                        }

                        if ( useParentWidth ) {
                            this.$elem.outerWidth( this.$elem.parent().innerWidth() );
                        }

                        this.$elem.css({
                            left: leftOffset
                        });

                        this.$context.addClass( this.options.stickyClass );
                        this.$elem.removeClass( this.options.stuckClass ).addClass( this.options.stickyClass );
                    },

                    "unstick": function () {
                        this.$context.removeClass( this.options.stickyClass );
                        this.$elem.removeAttr("style").removeClass( this.options.stuckClass + " " + this.options.stickyClass );
                    },

                    "stuck": function () {
                        this.$elem.removeClass( this.options.stickyClass ).addClass( this.options.stuckClass );

                        if ( !this.options.useParentWidth ) {
                            this.$elem.removeAttr("style");
                        }
                    },

            "initHerald": function () {
                var self = this;

                self.$window.plugin("herald", {
                    "events": self.heraldEvents
                });
            }
    };

    Sidekick.defaults = Sidekick.prototype.defaults;

    LB.apps.Sidekick = Sidekick;

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "sidekick", window.LB.apps.Sidekick );