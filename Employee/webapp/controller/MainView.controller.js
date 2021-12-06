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
                var oJSONModelEmpl = new sap.ui.model.json.JSONModel(),
                    oJSONModelCountries = new sap.ui.model.json.JSONModel(),
                    oView = this.getView();

                oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelEmpl, "jsonCountries");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonConfig");

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
                var oJSON = this.getView().getModel("jsonCountries").getData(),
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
                var oModel = this.getView().getModel("jsonCountries");

                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            },

            onPressListItem: function (oEvent) {
                var itemPressed = oEvent.getSource(),
                    oContext = itemPressed.getBindingContext("jsonEmployees"),
                    objectConext = oContext.getObject(),
                    orders = objectConext.Orders,
                    ordersTable = this.getView().byId("ordersTable"),
                    ordersItems = [];

                ordersTable.destroyItems();

                for (var index in orders) {
                    ordersItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: orders[index].OrderID }),
                            new sap.m.Label({ text: orders[index].Freight }),
                            new sap.m.Label({ text: orders[index].ShipAddress })
                        ]
                    }));
                }

                var newTable = new sap.m.Table({
                    width: "auto",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                    ],
                    items: ordersItems
                }).addStyleClass("sapUiSmallMargin");

                ordersTable.addItem(newTable);

                var newTableJSON = new sap.m.Table();
                newTableJSON.setWidth("auto");
                newTableJSON.addStyleClass("sapUiSmallMargin");

                var columnOrderID = new sap.m.Column();
                var labelOrderID = new sap.m.Label();
                labelOrderID.bindProperty("text", "i18n>orderID");
                columnOrderID.setHeader(labelOrderID);
                newTableJSON.addColumn(columnOrderID);

                var columnFreight = new sap.m.Column();
                var labelFreight = new sap.m.Label();
                labelFreight.bindProperty("text", "i18n>freight");
                columnFreight.setHeader(labelFreight);
                newTableJSON.addColumn(columnFreight);

                var columnShipAddress = new sap.m.Column();
                var labelShipAddress = new sap.m.Label();
                labelShipAddress.bindProperty("text", "i18n>shipAddress");
                columnShipAddress.setHeader(labelShipAddress);
                newTableJSON.addColumn(columnShipAddress);

                var columnListItem = new sap.m.ColumnListItem();

                var cellOrderID = new sap.m.Label();
                cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
                columnListItem.addCell(cellOrderID);

                var cellFreight = new sap.m.Label();
                cellFreight.bindProperty("text", "jsonEmployees>Freight");
                columnListItem.addCell(cellFreight);

                var cellShipAddress = new sap.m.Label();
                cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
                columnListItem.addCell(cellShipAddress);

                var oBindingInfo = {
                    model: "jsonEmployees",
                    path: "Orders",
                    template: columnListItem
                };

                newTableJSON.bindAggregation("items", oBindingInfo);
                newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

                ordersTable.addItem(newTableJSON);
            },

            onShowCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonConfig");

                oJSONModelConfig.setProperty("/visibleCity", true);
                oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
                oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
            },

            onHideCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonConfig");

                oJSONModelConfig.setProperty("/visibleCity", false);
                oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
                oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
            }
        });
    });
