define(["jquery", "webfont"],
    function ($, WebFont) {
        "use strict";

        function load(config) {
            var deferred = new $.Deferred();

            config.active = function () {
                deferred.resolve();
            };
            config.inactive = function () {
                deferred.reject();
            };

            WebFont.load(config);

            return deferred.promise();
        }


        /**
         * Utility class for loading webfonts via Google's API.
         *
         * @author Bo Gotthardt
         *
         * @constructor
         */
        function WebFontLoader() {
        }

        WebFontLoader.loadGoogle = function () {
            return load({
                google: {
                    families: arguments
                }
            });
        };

        WebFontLoader.loadTypekit = function (id) {
            return load({
                typekit: {
                    id: id
                }
            });
        };

        return WebFontLoader;
    });