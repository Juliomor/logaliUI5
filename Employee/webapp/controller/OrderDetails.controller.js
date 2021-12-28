// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, History, MessageBox, Filter, FilterOperator) {
        "use strict";

        function _onObjectMatched(oEvent) {
            this.onClearSignature();

            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind",
                events: {
                    dataReceived: function (oData) {
                        _readDependencies.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

            const oContext = this.getView().getModel("odataNorthwind").getContext("/Orders(" + oEvent.getParameter("arguments").OrderID + ")").getObject();

            if (oContext) {
                _readDependencies.bind(this)(oContext.OrderID, oContext.EmployeeID);
            }

        };

        function _readDependencies(orderId, EmployeeId) {
            //Read Signature
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId + "',SapId='" + this.getOwnerComponent().SapId + "',EmployeeId='" + EmployeeId + "')", {
                success: function (data) {
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                }.bind(this),
                error: function (data) {

                }
            });

            //Bind files
            this.getView().byId("uploadCollection").bindAggregation("items", {
                path: "incidenceModel>/FilesSet",
                filters: [
                    new Filter("OrderId", FilterOperator.EQ, orderId),
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, EmployeeId)],
                template: new sap.m.UploadCollectionItem({
                    documentId: "{incidenceModel>AttId}",
                    visibleEdit: false,
                    fileName: "{incidenceModel>FileName}"
                }).attachPress(this.downloadFile)
            });
        };

        return Controller.extend("alight.Employee.controller.OrderDetails", {

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },

            onNavBack: function (oEvent) {
                var oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            },

            onClearSignature: function () {
                var signature = this.getView().byId("signature");

                signature.clear();
            },

            factoryOrderDetails: function (listId, oContext) {
                var contextObj = oContext.getObject();
                contextObj.Currency = "EUR";
                var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObj.ProductID + ")/UnitsInStock");

                if (contextObj.Quantity <= unitsInStock) {
                    var objectListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + contextObj.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                        number: "{parts: [{path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                        numberUnit: "{odataNorthwind>Currency}"
                    });
                    return objectListItem;
                } else {
                    var customListItem = new sap.m.CustomListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.m.Label({
                                    text: "{odataNorthwind>/Products(" + contextObj.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"
                                }),
                                contentMiddle: new sap.m.ObjectStatus({
                                    text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObj.ProductID + ")/UnitsInStock}",
                                    state: "Error"
                                }),
                                contentRight: new sap.m.Label({
                                    text: "{parts: [{path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency'}"
                                })
                            })
                        ]
                    });
                    return customListItem;
                }
            },

            onSaveSignature: function (oEvent) {
                const signature = this.getView().byId("signature"),
                    oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var signaturePNG;

                if (!signature.isFilled()) {
                    MessageBox.error(oResourceBundle.getText("fillSignature"));
                } else {
                    signaturePNG = signature.getSignature().replace("data:image/png;base64,", "");
                    var objOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    var body = {
                        OrderId: objOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: objOrder.EmployeeID.toString(),
                        MimeType: "image/png",
                        MediaContent: signaturePNG
                    }
                    this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                        success: function () {
                            MessageBox.information(oResourceBundle.getText("signatureSaved"));
                        },
                        error: function () {
                            MessageBox.error(oResourceBundle.getText("signatureNotSaved"));
                        }
                    });
                }
            },

            onFileBeforeUpload: function (oEvent) {
                var fileName = oEvent.getParameter("fileName"),
                    oContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject(),
                    slug = oContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + oContext.EmployeeID + ";" + fileName,
                    oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                        name: "slug",
                        value: slug
                    });

                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileChange: function (oEvent) {
                var oUploadCollection = oEvent.getSource(),
                    oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                        name: "x-csrf-token",
                        value: this.getView().getModel("incidenceModel").getSecurityToken()
                    });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

            },

            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource(),
                    sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();

                this.getView().getModel("incidenceModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },

                    error: function () {

                    }
                });
            },

            downloadFile: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
                window.open("sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
            }
        });
    });