// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "alight/Employee/model/formatter"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter) {
        "use strict";

        return Controller.extend("alight.Employee.controller.EmployeeDetails", {
            formatter: formatter,
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();

            },

            onCreateIncidence: function () {
                var tableIncidence = this.getView().byId("tableIncidence"),
                    newIndicence = sap.ui.xmlfragment("alight.Employee.fragment.NewIncidence", this),
                    incidenceModel = this.getView().getModel("incidenceModel"),
                    oData = incidenceModel.getData(),
                    index = oData.length;

                oData.push({ index: index + 1 });
                incidenceModel.refresh();
                newIndicence.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newIndicence);
            },

            onDeleteIncidence: function (oEvent) {
                var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
                this._bus.publish("incidence", "onDeleteIncidence", {
                    IncidenceId: contextObj.IncidenceId,
                    SapId: contextObj.SapId,
                    EmployeeId: contextObj.EmployeeId
                });
            },

            onSaveIncidence: function (oEvent) {
                var rowIncidence = oEvent.getSource().getParent().getParent(),
                    oContext = rowIncidence.getBindingContext("incidenceModel");

                this._bus.publish("incidence", "onSaveIncidence", { rowIncidence: oContext.sPath.replace('/', '') });

            },


            updateIncidenceCreationDate: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject();

                contextObj.CreationDateX = true;

            },

            updateIncidenceReason: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject();

                contextObj.ReasonX = true;

            },

            updateIncidenceType: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject();

                contextObj.TypeX = true;

            },

        });
    });