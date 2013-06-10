/*global window*/
define(["jquery", "lib/lucid", "iframeapi", "css!styling/widget"],
    function ($, LucidJS, Iframe) {
        "use strict";

        /**
         * Generic base functionality for widgets.
         *
         * @event activate When the widget is potentially visible to the user.
         * @event deactivate When the widget is no longer visible to the user.
         * @event resize When the window is resized.
         * @event unload When the window is about to be destroyed.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} options
         */
        function BaseWidget(options) {
            var scope = this,
                $window = $(window);
            this.options = options;

            // Force the html element to keep its initial size, regardless of what content we insert later on.
            // This fixes an iOS 6 issue where the iframe will grow to adjust to its content.
            $("html").height($window.height())
                     .width($window.width());

            this.element = $("<div class='BaseWidget'></div>")
                .appendTo("body");

            /**
             * Whether the widget is currently active.
             * @type {Boolean}
             */
            this.active = false;

            /**
             * A promise for the widget having finished initializing.
             * Subclasses must resolve this when they are done initializing.
             * @type {$.Deferred}
             */
            this.initialized = new $.Deferred();

            Iframe.addEventListener(Iframe.IFRAME_WIDGET_ACTIVATE, function (event) {
                // event.publicationID, event.currentPages, event.widgetPages
                scope.activate(event);
            });

            Iframe.addEventListener(Iframe.IFRAME_WIDGET_DEACTIVATE, function (event) {
                // event.publicationID, event.currentPages, event.widgetPages
                scope.deactivate(event);
            });

            $window.on("resize", function () {
                scope.trigger("resize");
            });

            $window.on("beforeunload", function () {
                scope.trigger("unload");
            });
        }

        // Mix-in event handling functionality.
        LucidJS.emitter(BaseWidget.prototype);

        /**
         * Activate the widget. Is called automatically by the Iframe API.
         * @param event
         */
        BaseWidget.prototype.activate = function (event) {
            this.active = true;
            this.trigger("activate", event);
        };

        /**
         * Deactivate the widget. Is called automatically by the Iframe API.
         * @param event
         */
        BaseWidget.prototype.deactivate = function (event) {
            this.active = false;
            this.trigger("deactivate", event);
        };

        /**
         * Make the widget visible.
         */
        BaseWidget.prototype.show = function () {
            this.element.toggleClass("hidden", false);
        };

        /**
         * Hide the widget.
         */
        BaseWidget.prototype.hide = function () {
            this.element.toggleClass("hidden", true);
        };

        return BaseWidget;
    });