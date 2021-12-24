sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("alight.Employee.controller.Base", {

            onInit: function () {
            },

            toOrderDetails: function (oEvent) {

                var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID,
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteOrderDetails", { OrderID: orderID });
            }

        });
    });
