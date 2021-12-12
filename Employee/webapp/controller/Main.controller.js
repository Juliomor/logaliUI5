// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("alight.Employee.controller.Main", {

            onInit: function () {

                var oJSONModelEmpl = new sap.ui.model.json.JSONModel(),
                    oJSONModelCountries = new sap.ui.model.json.JSONModel(),
                    oJSONModelLayouts = new sap.ui.model.json.JSONModel(),
                    oView = this.getView();

                oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelEmpl, "jsonCountries");

                oJSONModelLayouts.loadData("./localService/mockdata/Layouts.json", false);
                oView.setModel(oJSONModelLayouts, "jsonLayouts");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonConfig");

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("felxible", "showEmployee", this.showEmployeeDetails, this);

            },

            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("jsonEmployees>" + path);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            }
        });
    });