// @ts-nocheck
/* eslint-disable no-undef */
sap.ui.define([], function () {
    "use strict";
    return {
        dateFormat: function (date) {

            var timeDay = 24 * 60 * 60 * 1000;

            if (date) {
                var dateNow = new Date(),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" }),
                    dateNowFormat = new Date(dateFormat.format(dateNow)),
                    oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                switch (true) {
                    //Today
                    case date.getTime() === dateNowFormat.getTime():
                        return oResourceBundle.getText("today");
                    //Tomorrow
                    case date.getTime() === dateNowFormat.getTime() + timeDay:
                        return oResourceBundle.getText("tomorrow");
                    //Yesterday
                    case date.getTime() === dateNowFormat.getTime() - timeDay:
                        return oResourceBundle.getText("yesterday");
                    default:
                        return "";
                }
            }
        }
    };
});