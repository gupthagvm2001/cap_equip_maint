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

            // Function to handle filtering
            function doFiltering() {
                var aFilters = [];
                var sSelectedPlant = oMultiComboBox1.getSelectedKeys();
                var sSelectedServiceDate = oMultiComboBox2.getSelectedKeys().map(function(dateString) {
                    // Convert date string to the desired format
                    var dateObject = new Date(dateString);
                    var formattedDate = oDateFormat.format(dateObject);
                    return formattedDate;
                });
                var sSelectedMachineID = oMultiComboBox3.getSelectedKeys();
 
                if (sSelectedPlant.length > 0) {
                    // Create filters for selected plants
                    var plantFilters = sSelectedPlant.map(function(plant) {
                        return new Filter("plant", FilterOperator.EQ, plant);
                    });
                    // Combine plant filters with OR condition
                    aFilters.push(new Filter({
                        filters: plantFilters,
                        and: false // Use "OR" conjunction
                    }));
                }
               
                if (sSelectedServiceDate.length > 0) {
                    // Create filters for selected service dates
                    var serviceDateFilters = sSelectedServiceDate.map(function(serviceDate) {
                        return new Filter("serviceDate", FilterOperator.EQ, serviceDate);
                    });
                    // Combine service date filters with OR condition
                    aFilters.push(new Filter({
                        filters: serviceDateFilters,
                        and: false // Use "OR" conjunction
                    }));
                }    
 
                if (sSelectedMachineID.length > 0) {
                    // Create filters for selected machine IDs
                    var machineFilters = sSelectedMachineID.map(function(machineID) {
                        return new Filter("machineID", FilterOperator.EQ, machineID);
                    });
                    // Combine machine filters with OR condition
                    aFilters.push(new Filter({
                        filters: machineFilters,
                        and: false // Use "OR" conjunction
                    }));
                }
                
                // Apply all filters with AND condition
                var oBinding = oTable.getBinding("items");                
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true // Use "AND" conjunction for all filters
                }));
            }
 
            // Attach filtering function to "Go" button press event
            oView.byId("goButton").attachPress(doFiltering);
        }
    });
});
