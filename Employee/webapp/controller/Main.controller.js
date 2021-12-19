// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("alight.Employee.controller.Main", {

            onBeforeRendering: function () {
                this.detailEmployeeView = this.getView().byId("detailEmployeeView");
            },

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
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveIncidence, this);

                this._bus.subscribe("incidence", "onDeleteIncidence", function (channelId, eventId, data) {

                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                    this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId + "',SapId='" + data.SapId + "',EmployeeId='" + data.EmployeeId + "')", {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(data.EmployeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteKO"));
                        }.bind(this)
                    });

                }, this);
            },

            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();
                this.onReadODataIncidence(this.detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
            },

            onSaveIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                    employeeId = this.detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID,
                    incidenceModel = this.detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.rowIncidence].IncidenceId === 'undefined') {

                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.rowIncidence].CreationDate,
                        Type: incidenceModel[data.rowIncidence].Type,
                        Reason: incidenceModel[data.rowIncidence].Reason
                    };

                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);
                            //sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"));
                            MessageBox.success(oResourceBundle.getText("oDataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                        }.bind(this)
                    });
                } else if (incidenceModel[data.rowIncidence].CreationDateX || incidenceModel[data.rowIncidence].ReasonX || incidenceModel[data.rowIncidence].TypeX) {
                    var body = {
                        CreationDate: incidenceModel[data.rowIncidence].CreationDate,
                        Type: incidenceModel[data.rowIncidence].Type,
                        Reason: incidenceModel[data.rowIncidence].Reason,
                        CreationDateX: incidenceModel[data.rowIncidence].CreationDateX,
                        TypeX: incidenceModel[data.rowIncidence].TypeX,
                        ReasonX: incidenceModel[data.rowIncidence].ReasonX
                    };

                    this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.rowIncidence].IncidenceId + "',SapId='" + incidenceModel[data.rowIncidence].SapId + "',EmployeeId='" + incidenceModel[data.rowIncidence].EmployeeId + "')", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdatedOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdatedKO"));
                        }.bind(this)
                    });
                }
                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("oDataNoChanges"));
                }
            },

            onReadODataIncidence: function (employeeID) {
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {

                        var incidenceModel = this.detailEmployeeView.getModel("incidenceModel"),
                            tableIncidence = this.detailEmployeeView.byId("tableIncidence");

                        incidenceModel.setData(data.results);
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            data.results[incidence]._ValidateDate = true;
                            data.results[incidence].EnabledSave = false;
                            var newIndicence = sap.ui.xmlfragment("alight.Employee.fragment.NewIncidence", this.detailEmployeeView.getController());
                            this.detailEmployeeView.addDependent(newIndicence);
                            newIndicence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIndicence);
                        }
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                    }.bind(this)
                });
            }
        });
    });