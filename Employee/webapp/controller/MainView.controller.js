// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("alight.Employee.controller.MainView", {
            onInit: function () {

            },

            onValidate: function () {
                var inputEmployee = this.getView().byId("inputEmployee"),
                    employeeValue = inputEmployee.getValue(),
                    labelCountry = this.getView().byId("labelCountry"),
                    selectCountry = this.byId("slCountry");

                if (employeeValue.length === 6) {
                    labelCountry.setVisible(true);
                    selectCountry.setVisible(true);
                } else {
                    labelCountry.setVisible(false);
                    selectCountry.setVisible(false);
                }
            }
        });
    });
