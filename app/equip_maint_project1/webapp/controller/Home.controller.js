sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.equipmaintproject1.controller.Home", {
        onInit: function() {
            this._oTable = this.byId("table0");
        },
        onOpenAddDialog: function() {
            this.getView().byId("OpenDialog").open();
        },
        onCancelDialog: function(oEvent) {
            oEvent.getSource().getParent().close();
        },
        onSearch: function(oEvent) {
            var sSearchValue = oEvent.getParameter("query");
            var oTable = this.getView().byId("table0");
            var oBinding = oTable.getBinding("items");
            var fields = ["maintID", "machineID", "machineDescription", "maintenanceLocation", "serviceDate", "technician", "maintenanceType", "technicianComments", "plant", "plantDescription", "laborCost", "sparePartsCost", "currencyType"];
            var aFilters = [];
            for (var i = 0; i < fields.length; i++) {
                var oFilter = new Filter(fields[i], FilterOperator.Contains, sSearchValue);
                aFilters.push(oFilter);
            }
            oBinding.filter(new Filter({
                filters: aFilters,
                and: false
            }));
        },
        onFilterChange: function(oEvent) {
            // Handle filter change event
            var aFilters = oEvent.getParameter("filters");
            MessageToast.show("Filters changed");
        },
        onAfterVariantLoad: function() {
            MessageToast.show("Variant loaded");
        },
        onSelectionChange: function(oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems");
            MessageToast.show(aSelectedItems.length + " items selected");
        },
        fetchData: function() {
            var aData = this.oFilterBar.getAllFilterItems().reduce(function(aResult, oFilterItem) {
                aResult.push({
                    groupName: oFilterItem.getGroupName(),
                    fieldName: oFilterItem.getName(),
                    fieldData: oFilterItem.getControl().getSelectedKeys()
                });

                return aResult;
            }, []);

            return aData;
        },
        applyData: function(aData) {
            aData.forEach(function(oDataObject) {
                var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                oControl.setSelectedKeys(oDataObject.fieldData);
            }, this);
        },
        getFiltersWithValues: function() {
            var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function(aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl();

                if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                    aResult.push(oFilterGroupItem);
                }

                return aResult;
            }, []);

            return aFiltersWithValue;
        },
        _updateLabelsAndTable: function() {
            this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
            this.oSnappedLabel.setText(this.getFormattedSummaryText());
            this.oTable.setShowOverlay(true);
        },
        getFormattedSummaryText: function() {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            if (aFiltersWithValues.length === 1) {
                return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
            }

            return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
        },
        getFormattedSummaryTextExpanded: function() {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            var sText = aFiltersWithValues.length + " filters active",
                aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();

            if (aFiltersWithValues.length === 1) {
                sText = aFiltersWithValues.length + " filter active";
            }

            if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
            }

            return sText;
        }
    });
});
