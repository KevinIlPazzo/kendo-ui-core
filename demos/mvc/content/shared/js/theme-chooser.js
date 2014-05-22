(function() {
    var ThemeChooser,
        doc = document,
        extend = $.extend,
        kendo = window.kendo,
        animation = {
            show: {
                effects: "fadeIn",
                duration: 300
            },
            hide: {
                effects: "fadeOut",
                duration: 300
            }
        },
        skinRegex = /kendo\.[\w\-]+(\.min)?\.(less|css)/i,
        dvSkinRegex = /kendo\.dataviz\.(?!min)\w+?(\.css|\.min.css)/gi;

    ThemeChooser = kendo.ui.Widget.extend({
        init: function(element, options) {
            kendo.ui.Widget.fn.init.call(this, element, options);

            var element = this.element;
            var options = this.options;
            var template = options.template;

            if (typeof template == "string") {
                template = kendo.template(template);
            }

            element.find(options.container).html(
                template(options)
            );
        },
        options: {
            name: "ThemeChooser",
            themes: [
                { name: "Default", colors: [ "#ef6f1c", "#e24b17", "#5a4b43" ]  },
                { name: "Blue Opal", colors: [ "#076186", "#7ed3f6", "#94c0d2" ]  },
                { name: "Bootstrap", colors: [ "#3276b1", "#67afe9", "#fff" ]  },
                { name: "Silver", colors: [ "#298bc8", "#515967", "#eaeaec" ]  },
                { name: "Uniform", colors: [ "#666", "#ccc", "#fff" ]  },
                { name: "Metro", colors: [ "#8ebc00", "#787878", "#fff" ]  },
                { name: "Black", colors: [ "#0167cc", "#4698e9", "#272727" ]  },
                { name: "Metro Black", colors: [ "#00aba9", "#0e0e0e", "#565656" ]  },
                { name: "High Contrast", colors: [ "#b11e9c", "#880275", "#1b141a" ]  },
                { name: "Moonlight", colors: [ "#ee9f05", "#40444f", "#212a33" ]  },
                { name: "Flat", colors: [ "#363940", "#2eb3a6", "#fff" ]  }
            ],
            sizes: [
                { name: "Standart" },
                { name: "Bootstrap", relativity: "larger" }
            ]
        }
    });

    extend(ThemeChooser, {
        preloadStylesheet: function (file, callback) {
            var element = $("<link rel='stylesheet' media='print' href='" + file + "' />").appendTo("head");

            setTimeout(function () {
                callback();
                element.remove();
            }, 100);
        },

        getCurrentCommonLink: function () {
            return $("head link").filter(function () {
                return (/kendo\.common/gi).test(this.href);
            });
        },

        getCurrentThemeLink: function () {
            return $("head link").filter(function () {
                return (/kendo\./gi).test(this.href) && !(/common|rtl|dataviz|mobile/gi).test(this.href);
            });
        },

        getCurrentMobileThemeLink: function () {
            return $("head link").filter(function () {
                return (/kendo\.[^\.\/]+?\.mobile/gi).test(this.href) && !(/common|rtl|dataviz/gi).test(this.href);
            });
        },

        getCurrentDVThemeLink: function () {
            return $("head link").filter(function () {
                return dvSkinRegex.test(this.href);
            });
        },

        getCommonUrl: function (common) {
            var currentCommonUrl = ThemeChooser.getCurrentCommonLink().attr("href");

            return currentCommonUrl.replace(skinRegex, "kendo." + common + "$1.$2");
        },

        getThemeUrl: function (themeName) {
            var currentThemeUrl = ThemeChooser.getCurrentThemeLink().attr("href");

            return currentThemeUrl.replace(skinRegex, "kendo." + themeName + "$1.$2");
        },

        getDVThemeUrl: function (themeName) {
            var currentThemeUrl = ThemeChooser.getCurrentDVThemeLink().attr("href");
            if (currentThemeUrl) {
                return currentThemeUrl.replace(dvSkinRegex, "kendo.dataviz." + themeName + "$1");
            }
        },

        replaceWebTheme: function (themeName) {
            var newThemeUrl = ThemeChooser.getThemeUrl(themeName),
                oldThemeName = $(doc).data("kendoSkin"),
                themeLink = ThemeChooser.getCurrentThemeLink();

            ThemeChooser.updateLink(themeLink, newThemeUrl);

            ThemeChooser.publishTheme(themeName);
            $(doc.documentElement).removeClass("k-" + oldThemeName).addClass("k-" + themeName);
        },

        replaceWebMobileTheme: function (themeName) {
            var newThemeUrl = ThemeChooser.getThemeUrl(themeName + ".mobile"),
                themeLink = ThemeChooser.getCurrentMobileThemeLink();

            ThemeChooser.updateLink(themeLink, newThemeUrl);
        },

        replaceDVTheme: function (themeName) {
            var newThemeUrl = ThemeChooser.getDVThemeUrl(themeName),
                themeLink = ThemeChooser.getCurrentDVThemeLink();

            if (newThemeUrl) {
                ThemeChooser.updateLink(themeLink, newThemeUrl);
            }
        },

        updateLink: function (link, url) {
            var newLink,
                exampleElement = $("#example"),
                less = window.less,
                isLess = /\.less$/.test(link.attr("href"));

            if (kendo.support.browser.msie && kendo.support.browser.version < 11) {
                newLink = $(doc.createStyleSheet(url));
            } else {
                newLink = link.eq(0).clone().attr("href", url);
                link.eq(0).before(newLink);
            }

            link.remove();

            if (isLess) {
                $("head style[id^='less']").remove();

                less.sheets = $("head link[href$='.less']").map(function () {
                    return this;
                });

                less.refresh(true);
            }

            if (exampleElement.length) {
                exampleElement[0].style.cssText = exampleElement[0].style.cssText;
            }
        },

        replaceTheme: function (themeName) {
            ThemeChooser.replaceWebTheme(themeName);
            ThemeChooser.replaceWebMobileTheme(themeName);
            ThemeChooser.replaceDVTheme(themeName);

            $("#example").trigger("kendo:skinChange");
        },

        publishTheme: function (themeName) {
            var themable = ["Chart", "Diagram", "StockChart", "Sparkline", "RadialGauge", "LinearGauge"];

            if (kendo.dataviz) {
                for (var i = 0; i < themable.length; i++) {
                    var widget = kendo.dataviz.ui[themable[i]];

                    if (widget) {
                        widget.fn.options.theme = themeName;
                    }
                }
            }

            $(doc).data("kendoSkin", themeName);
        },

        changeTheme: function (themeName, animate, complete) {
            // Set transparent background to the chart area.
            extend(kendo.dataviz.ui.themes[themeName].chart, { chartArea: { background: "transparent"} });

            if (ThemeChooser.getThemeUrl(themeName) == ThemeChooser.getCurrentThemeLink().attr("href")) {
                return;
            }

            if (animate) {
                ThemeChooser.preloadStylesheet(ThemeChooser.getThemeUrl(themeName), function () {
                    var example = $("#example");

                    example.kendoStop().kendoAnimate(extend({}, animation.hide, { complete: function (element) {
                        if (element[0] == example[0]) {
                            example.css("visibility", "hidden"); // Hide the element with restored opacity.
                            ThemeChooser.replaceTheme(themeName);
                            setTimeout(function () {
                                example
                                    .css("visibility", "visible")
                                    .kendoStop()
                                    .kendoAnimate(animation.show);
                                complete();
                            }, 100);
                        }
                    }
                    }));
                });
            } else {
                ThemeChooser.replaceTheme(themeName);
            }
        },
    });

    kendo.ui.plugin(ThemeChooser);

    window.kendoThemeChooser = ThemeChooser;
})();
