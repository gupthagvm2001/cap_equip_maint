sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/Label',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/comp/smartvariants/PersonalizableInfo'
], function(Controller, Label, Filter, FilterOperator, PersonalizableInfo) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.filterbar.DynamicPageListReport.DynamicPageListReport", {
		onInit: function() {
            this._oTable = this.byId("table0");
		},

		onExit: function() {
			this.oModel = null;
			this.oSmartVariantManagement = null;
			this.oExpandedLabel = null;
			this.oSnappedLabel = null;
			this.oFilterBar = null;
			this.oTable = null;
		}
	});
});
