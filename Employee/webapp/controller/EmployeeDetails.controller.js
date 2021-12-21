// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "alight/Employee/model/formatter",
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, formatter, MessageBox) {
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

                oData.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
                incidenceModel.refresh();
                newIndicence.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newIndicence);
            },

            onDeleteIncidence: function (oEvent) {
                var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

                MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            this._bus.publish("incidence", "onDeleteIncidence", {
                                IncidenceId: contextObj.IncidenceId,
                                SapId: contextObj.SapId,
                                EmployeeId: contextObj.EmployeeId
                            });
                        }
                    }.bind(this)
                });
            },

            onSaveIncidence: function (oEvent) {
                var rowIncidence = oEvent.getSource().getParent().getParent(),
                    oContext = rowIncidence.getBindingContext("incidenceModel");

                this._bus.publish("incidence", "onSaveIncidence", { rowIncidence: oContext.sPath.replace('/', '') });

            },


            updateIncidenceCreationDate: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject(),
                    resourceBundle = this.getView().getModel("i18n").getResourceBundle();

                if (!oEvent.getSource().isValidValue()) {
                    contextObj._ValidateDate = false;
                    contextObj.CreationDateState = "Error";
                    MessageBox.error(resourceBundle.getText("invalidDate"), {
                        title: "Error",
                        onClose: null,
                        styleClass: "",
                        actions: MessageBox.Action.Close,
                        emphasizedAction: null,
                        initialFocus: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                } else {
                    contextObj.CreationDateX = true;
                    contextObj._ValidateDate = true;
                    contextObj.CreationDateState = "None";
                }

                if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }

                context.getModel().refresh();
            },

            updateIncidenceReason: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject();

                if (!oEvent.getSource().getValue()) {
                    contextObj.ReasonState = "Error";
                } else {
                    contextObj.ReasonX = true;
                    contextObj.ReasonState = "None";
                }

                if (oEvent.getSource().getValue() && contextObj._ValidateDate) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }

                context.getModel().refresh();
            },

            updateIncidenceType: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel"),
                    contextObj = context.getObject();

                if (contextObj.Reason && contextObj._ValidateDate) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }
                contextObj.TypeX = true;
                context.getModel().refresh();

            },

            toOrderDetails: function (oEvent) {

                var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID,
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteOrderDetails", { OrderID: orderID });
            }

        });
    });