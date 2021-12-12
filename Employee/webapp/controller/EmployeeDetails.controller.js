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
                var tableIncidence = this.getView().byId("tableIncidence"),
                    rowIncidence = oEvent.getSource().getParent().getParent(),
                    incidenceModel = this.getView().getModel("incidenceModel"),
                    oData = incidenceModel.getData(),
                    oContext = rowIncidence.getBindingContext("incidenceModel");

                oData.splice(oContext.index - 1, 1);
                for (var i in oData) {
                    oData[i].index = parseInt(i) + 1;
                }

                incidenceModel.refresh();
                tableIncidence.removeContent(rowIncidence);

                for (var j in tableIncidence.getContent()) {
                    tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
                }
            }
        });
    });