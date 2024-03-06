sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/Label',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/comp/smartvariants/PersonalizableInfo'
], function(Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo) {
    "use strict";

    return Controller.extend("com.sap.equipmaintproject1.controller.Home", {
        onInit: function() {
            this._oTable = this.byId("table0");
            var oView = this.getView();
            var oTable = oView.byId("table0");
            var oMultiComboBox1 = oView.byId("MCB01");
            var oMultiComboBox2 = oView.byId("MCB02");
            var oMultiComboBox3 = oView.byId("MCB03");

            // Handler for MultiComboBox selection change event
            function onSelectionChange() {
                var aFilters = [];
                var sSelectedPlant = oMultiComboBox1.getSelectedKeys();
                var sSelectedServiceDate = oMultiComboBox2.getSelectedKeys();
                var sSelectedMachineID = oMultiComboBox3.getSelectedKeys();

                if (sSelectedPlant.length > 0) {
                    aFilters.push(new Filter("plant", FilterOperator.EQ, oMultiComboBox1.getSelectedKeys()));
                }

                if (sSelectedServiceDate.length > 0) {
                    aFilters.push(new Filter("serviceDate", FilterOperator.EQ));
                }

                if (sSelectedMachineID.length > 0) {
                    var aMachineIDFilters = sSelectedMachineID.map(function(machineID) {
                        return new Filter("machineID", FilterOperator.EQ, machineID);
                    });
                    aFilters.push(new Filter({
                        filters: aMachineIDFilters,
                        and: false // Apply OR condition among multiple machine IDs
                    }));
                }

                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);
            }

            // Attach selection change event handlers
            oMultiComboBox1.attachSelectionChange(onSelectionChange);
            oMultiComboBox2.attachSelectionChange(onSelectionChange);
            oMultiComboBox3.attachSelectionChange(onSelectionChange);
        }
    });
});
