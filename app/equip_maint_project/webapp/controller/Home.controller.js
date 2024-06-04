sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/format/DateFormat'
], function(Controller, Filter, FilterOperator, DateFormat) {
    "use strict";

    return Controller.extend("com.sap.equipmaintproject.controller.Home", {
        onInit: function() {
            var oView = this.getView();
            var oTable = oView.byId("table0");
            var oMultiComboBox1 = oView.byId("MCB01");
            
            var oMultiComboBox3 = oView.byId("MCB03");
            var oDatePickerFrom = oView.byId("DP01_From");
            var oDatePickerTo = oView.byId("DP01_To");
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "YYYY-MM-dd"
            });

            function doFiltering() {
                var aFilters = [];
        
                // Plant filter
                var sSelectedPlant = oMultiComboBox1.getSelectedKeys();
                if (sSelectedPlant.length > 0) {
                    var plantFilters = sSelectedPlant.map(function(plant) {
                        return new Filter("plant", FilterOperator.EQ, plant);
                    });
                    aFilters.push(new Filter({
                        filters: plantFilters,
                        and: false
                    }));
                }
        
                var sDateFrom = oDatePickerFrom.getDateValue();
                var sDateTo = oDatePickerTo.getDateValue();
                if (sDateFrom && sDateTo) {
                    var formattedDateFrom = oDateFormat.format(sDateFrom);
                    var formattedDateTo = oDateFormat.format(sDateTo);
                    var dateFilters = new Filter({
                        filters: [
                            new Filter("serviceDate", FilterOperator.BT, formattedDateFrom, formattedDateTo)
                        ],
                        and: true
                    });
                    aFilters.push(dateFilters);
                }
        
                var sSelectedMachineID = oMultiComboBox3.getSelectedKeys();
                if (sSelectedMachineID.length > 0) {
                    var machineFilters = sSelectedMachineID.map(function(machineID) {
                        return new Filter("machineID", FilterOperator.EQ, machineID);
                    });
                    aFilters.push(new Filter({
                        filters: machineFilters,
                        and: false
                    }));
                }
        
                // Apply filters to table binding
                var oBinding = oTable.getBinding("items");
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));
            }
        
            oView.byId("goButton").attachPress(doFiltering);
        },
        
        onInputChange: function(oEvent) {
            try {
                var sNewValue = oEvent.getParameter("value");
                var sPath = oEvent.getSource().getBindingContext("mainModel").getPath();
                var oModel = this.getView().getModel("mainModel");
                sap.m.MessageToast.show("Updated new value: " + sNewValue);
                oModel.setProperty(sPath, sNewValue);
            } catch (error) {
                console.error("Error occurred in onInputChange:", error);
            }
        },

        onSave: function() {
            var oModel = this.getView().getModel("mainModel");
            this._setBusy(true);
            oModel.submitChanges({
                success: function() {
                    sap.m.MessageToast.show("Changes saved successfully");
                    this._setBusy(false);
                }.bind(this),
                error: function(oError) {
                    sap.m.MessageBox.error("Error saving changes: " + oError.message);
                    this._setBusy(false);
                }.bind(this)
            });
        },

        onDeleteSelected: function() {
            try {
                var oTable = this.getView().byId("table0");
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Select entries to delete.");
                    return;
                }

                sap.m.MessageBox.confirm("Delete selected entries?", {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function(oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            aSelectedItems.forEach(function(oSelectedItem) {
                                var oContext = oSelectedItem.getBindingContext("mainModel");
                                var sUserName = oContext.getProperty("maintID");

                                oContext.delete().then(function() {
                                    sap.m.MessageToast.show("Entries deleted successfully");
                                }.bind(this), function(oError) {
                                    if (oError.canceled) {
                                        sap.m.MessageToast.show("Deletion restored");
                                        return;
                                    }
                                    sap.m.MessageBox.error(oError.message + ": " + sUserName);
                                }.bind(this));
                            }.bind(this));

                            oTable.removeSelections();
                        } else {
                            sap.m.MessageToast.show("Deletion cancelled.");
                        }
                    }.bind(this)
                });

            } catch (error) {
                console.error("Error occurred in onDeleteSelected:", error);
                sap.m.MessageToast.show("Error deleting entries!", {
                    duration: 5000,
                    icon: sap.m.MessageBox.Icon.ERROR
                });
            }
        },

        onCreateDialog: function() {
            var oView = this.getView();
            var oDialog = this.byId("createDialog");
            var oList = this.byId("table0");
            var oBinding = oList.getBinding("items");

            var oNewEntry = {
                maintID: (oView.byId("newMaintID").getValue()).toString(),
                machineID: oView.byId("newMachineID").getValue(),
                machineDescription: oView.byId("newMachineDescription").getValue(),
                maintenanceLocation: oView.byId("newMaintenanceLocation").getValue(),
                serviceDate: oView.byId("newServiceDate").getValue(),
                technician: oView.byId("newTechnician").getValue(),
                maintenanceType: oView.byId("newMaintenanceType").getValue(),
                technicianComments: oView.byId("newTechnicianComments").getValue(),
                plant: (oView.byId("newPlant").getValue()).toString(),
                plantDescription: oView.byId("newPlantDescription").getValue(),
                laborCost: parseFloat(oView.byId("newLaborCost").getValue()),
                sparePartsCost: parseFloat(oView.byId("newSparePartsCost").getValue()),
                currencyType: oView.byId("newCurrencyType").getValue()
            };

            // Create a new entry through the table's list binding
            var oContext = oBinding.create(oNewEntry);

            this._setBusy(false);
            this.getView().getModel("appView").setProperty("/usernameEmpty", true);

            // Select and focus the table row that contains the newly created entry
            oList.getItems().some(function(oItem) {
                if (oItem.getBindingContext() === oContext) {
                    oItem.focus();
                    oItem.setSelected(true);
                    return true;
                }
            });

            oDialog.close();
        },

        onCreateCancel: function() {
            var oDialog = this.byId("createDialog");
            oDialog.close();
        },

        _setBusy: function(bBusy) {
            this.getView().setBusy(bBusy);
        }
    });
});
