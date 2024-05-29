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
            var oMultiComboBox2 = oView.byId("MCB02");
            var oMultiComboBox3 = oView.byId("MCB03");
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "YYYY-MM-dd" // Set the desired date format
            });

            function doFiltering() {
                var aFilters = [];
                var sSelectedPlant = oMultiComboBox1.getSelectedKeys();
                var sSelectedServiceDate = oMultiComboBox2.getSelectedKeys().map(function(dateString) {
                    var dateObject = new Date(dateString);
                    var formattedDate = oDateFormat.format(dateObject);
                    return formattedDate;
                });
                var sSelectedMachineID = oMultiComboBox3.getSelectedKeys();
 
                if (sSelectedPlant.length > 0) {
                    var plantFilters = sSelectedPlant.map(function(plant) {
                        return new Filter("plant", FilterOperator.EQ, plant);
                    });
                    aFilters.push(new Filter({
                        filters: plantFilters,
                        and: false 
                    }));
                }
               
                if (sSelectedServiceDate.length > 0) {
                    var serviceDateFilters = sSelectedServiceDate.map(function(serviceDate) {
                        return new Filter("serviceDate", FilterOperator.EQ, serviceDate);
                    });
                    aFilters.push(new Filter({
                        filters: serviceDateFilters,
                        and: false 
                    }));
                }    
 
                if (sSelectedMachineID.length > 0) {
                    var machineFilters = sSelectedMachineID.map(function(machineID) {
                        return new Filter("machineID", FilterOperator.EQ, machineID);
                    });
                    aFilters.push(new Filter({
                        filters: machineFilters,
                        and: false 
                    }));
                }
                
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
                oModel.setProperty(sPath, sNewValue);
                console.log("Updated Model Data:", oModel.getData());
            } catch (error) {
                console.error("Error occurred in onInputChange:", error);
            }
        },

        onSave: function() {
            try {
                var oModel = this.getView().getModel("mainModel");
                var oData = oModel.getData(); // Retrieve data from the model
                console.log("Data to be saved:", oData);
        
                oModel.create("/EntitySet", oData, {
                    success: function() {
                        console.log("Data saved successfully.");
                    },
                    error: function(oError) {
                        console.error("Error occurred while saving data:", oError);
                    }
                });
            } catch (error) {
                console.error("Error occurred in onSave:", error);
            }
        },
        onDeleteSelected: function() {
            try {
                var oTable = this.getView().byId("table0");
                var oModel = this.getView().getModel("mainModel");
                var aSelectedItems = oTable.getSelectedItems();
        
                if (aSelectedItems.length === 0) {
                    return;
                }
        
                aSelectedItems.forEach(function(oSelectedItem) {
                    var oBindingContext = oSelectedItem.getBindingContext("mainModel");
                    var sPath = oBindingContext.getPath();
                    oModel.remove(sPath); 
                });
        
                oTable.removeSelections();
            } catch (error) {
                console.error("Error occurred in onDeleteSelected:", error);
            }
        },
        onCreateDialog: function() {
            var oView = this.getView();
            if (!this.byId("createDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.sap.equipmaintproject.view.CreateDialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("createDialog").open();
            }
        },

        onCreateConfirm: function() {
            var oView = this.getView();
            var oDialog = this.byId("createDialog");

            var oNewMaintID = parseInt(oView.byId("newMaintID").getValue()).toString();
            var oNewMachineID = parseInt(oView.byId("newMachineID").getValue());
            var oNewMachineDescription = oView.byId("newMachineDescription").getValue();
            var oNewMaintenanceLocation = oView.byId("newMaintenanceLocation").getValue();
            var oNewServiceDate = oView.byId("newServiceDate").getValue();
            var oNewTechnician = oView.byId("newTechnician").getValue();
            var oNewMaintenanceType = oView.byId("newMaintenanceType").getValue();
            var oNewTechnicianComments = oView.byId("newTechnicianComments").getValue();
            var oNewPlant = oView.byId("newPlant").getValue();
            var oNewPlantDescription = oView.byId("newPlantDescription").getValue();
            var oNewLaborCost = parseFloat(oView.byId("newLaborCost").getValue());
            var oNewSparePartsCost = parseFloat(oView.byId("newSparePartsCost").getValue());
            var oNewCurrencyType = oView.byId("newCurrencyType").getValue();

            var oNewEntry = {
                maintID: oNewMaintID,
                machineID: oNewMachineID,
                machineDescription: oNewMachineDescription,
                maintenanceLocation: oNewMaintenanceLocation,
                serviceDate: oNewServiceDate,
                technician: oNewTechnician,
                maintenanceType: oNewMaintenanceType,
                technicianComments: oNewTechnicianComments,
                plant: oNewPlant,
                plantDescription: oNewPlantDescription,
                laborCost: oNewLaborCost,
                sparePartsCost: oNewSparePartsCost,
                currencyType: oNewCurrencyType
            };

            var oModel = this.getView().getModel("mainModel");
            var aItems = oModel.getProperty("/EquipMaint");
            aItems.push(oNewEntry);
            oModel.setProperty("/EquipMaint", aItems);

            // Close dialog
            oDialog.close();
            MessageBox.success("Maintenance record created successfully.");
        },

        onCreateCancel: function() {
            var oDialog = this.byId("createDialog");
            oDialog.close();
        }            
    });
});
