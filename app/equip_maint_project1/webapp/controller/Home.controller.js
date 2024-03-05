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
        // currently we are not using the below as we dont require search feature
        onOpenAddDialog: function() {
            this.getView().byId("OpenDialog").open();
        },
        onCancelDialog: function(oEvent) {
            oEvent.getSource().getParent().close();
        },
        onSearch: function () {
			var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
				var oControl = oFilterGroupItem.getControl(),
					aSelectedKeys = oControl.getSelectedKeys(),
					aFilters = aSelectedKeys.map(function (sSelectedKey) {
						return new Filter({
							path: oFilterGroupItem.getName(),
							operator: FilterOperator.Contains,
							value1: sSelectedKey
						});
					});

				if (aSelectedKeys.length > 0) {
					aResult.push(new Filter({
						filters: aFilters,
						and: false
					}));
				}

				return aResult;
			}, []);

			this.oTable.getBinding("items").filter(aTableFilters);
			this.oTable.setShowOverlay(false);
		},
        
        /* onSearch: function(oEvent) {
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
        }, */
        onFilterChange: function () {
			this._updateLabelsAndTable();
		},

		onAfterVariantLoad: function () {
			this._updateLabelsAndTable();
		},
        onSelectionChange: function (oEvent) {
			this.oSmartVariantManagement.currentVariantSetModified(true);
			this.oFilterBar.fireFilterChange(oEvent);
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
        formatDistinctPlants: function(oData) {
            if (!oData || !Array.isArray(oData)) {
                return [];
            }
        
            // Create a map to store unique plant values
            var uniquePlantsMap = {};
        
            // Loop through the data to populate uniquePlantsMap
            oData.forEach(function(item) {
                uniquePlantsMap[item.plant] = true;
            });
        
            // Extract unique plant values from the map
            var uniquePlants = Object.keys(uniquePlantsMap);
        
            // Format the unique plant values into items array for the MultiComboBox
            return uniquePlants.map(function(plant) {
                return new sap.ui.core.Item({
                    key: plant,
                    text: plant
                });
            });
        },
        
        // Define similar formatter functions for other fields if needed
        
    });
});
