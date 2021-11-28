// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("alight.Employee.controller.MainView", {
            onInit: function () {
                var oJSONModel = new sap.ui.model.json.JSONModel(),
                    oView = this.getView(),
                    i18nBundle = oView.getModel("i18n").getResourceBundle();

                // var iJSON = {
                //     employeeId: "12345",
                //     countryKey: "ES",
                //     listCountry: [
                //         {
                //             key: "US",
                //             text: i18nBundle.getText("countryUS")
                //         },
                //         {
                //             key: "UK",
                //             text: i18nBundle.getText("countryUK")
                //         },
                //         {
                //             key: "ES",
                //             text: i18nBundle.getText("countryES")
                //         }
                //     ]
                // }
                // oJSONModel.setData(iJSON);

                oJSONModel.loadData("./localService/mockdata/Employees.json");
                oJSONModel.attachRequestCompleted(function (oEvent) {
                    console.log(JSON.stringify(oJSONModel.getData()));
                });
                oView.setModel(oJSONModel);
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
            },

            onPressFilter: function () {
                var oJSON = this.getView().getModel().getData(),
                    filters = [];

                if (oJSON.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
                }

                if (oJSON.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
                }

                var oList = this.getView().byId("tableEmployee"),
                    oBinding = oList.getBinding("items");

                oBinding.filter(filters);
            },

            onPressClearFilter: function () {
                var oModel = this.getView().getModel();

                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            }
        });
    });
