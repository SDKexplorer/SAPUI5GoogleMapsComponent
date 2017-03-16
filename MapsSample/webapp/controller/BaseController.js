sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/Device"
], function(Controller, ResourceModel, Device) {
	"use strict";
	var controller = Controller.extend("MapsSample.controller.BaseController", {
		onInit: function() {
			//   this._setContentDensityClass();
		},
		_getResourceBundle: function() {
			if (!this._resourceBundle) {
				this._resourceBundle = this.getModel("i18n")
					.getResourceBundle();
			}
			return this._resourceBundle;
		},
		getTextFromI18n: function() {
			var bundle = this._getResourceBundle();
			return bundle.getText.apply(bundle, arguments);
		},
		_getEventBus: function() {
			return sap.ui.getCore().getEventBus();
		},
		subscribeToEventBus: function(config) {
			var eventBus = this._getEventBus();
			eventBus.subscribe(
				config.channel,
				config.event,
				config.handler,
				config.scope || this
			);
		},
		publishToEventBus: function(config) {
			var eventBus = this._getEventBus();
			eventBus.publish(
				config.channel,
				config.event,
				config.data
			);
		},
		getModel: function(modelName) {
			var view = this.getView();
			var component = this.getOwnerComponent();

			return view.getModel.apply(view, [modelName]) || component.getModel(modelName);
		},
		setModel: function(model, modelName, setGlobal) {
			var view = this.getView();

			if (setGlobal) {
				return this.getOwnerComponent().setModel(model, modelName);
			}

			this.getView().setModel.apply(view, [model, modelName]);
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		_setContentDensityClass: function() {
			var contentDensityClass = (Device.support.touch) ? "sapUiSizeCozy" : "sapUiSizeCompact";
			this.getView().addStyleClass(contentDensityClass);
		},
		getAppState: function() {
			return this.getModel("appState");
		},
		getAppStateValue: function(key) {
			return this.getAppState().getProperty("/data/" + key);
		},
		setAppStateValue: function(key, value) {
			this.getAppState().setProperty("/data/" + key, value);
		},

		upperCaseFirst: function(value) {
			return value.charAt(0).toUpperCase() + value.substring(1);
		},

		/**
		 * Converts a month number to a reporting period number.
		 * @param string|number monthNumber number of the month i.e. 5
		 * @param boolean countFromOne start counting months from one if true, else from zero (false by default)
		 *
		 * @returns string reporting period number.
		 *
		 * Examples:
		 * monthToReportingPeriod(1) => "002"
		 * monthToReportingPeriod(10) => "011"
		 * monthToReportingPeriod(10, true) => "010"
		 */
		monthToReportingPeriod: function(monthNumber, countFromOne) {
			var reportingPeriod = parseInt(monthNumber, 10);

			if (!countFromOne) {
				reportingPeriod++;
			}

			if (reportingPeriod < 10) {
				reportingPeriod = "0" + reportingPeriod;
			}

			return "0" + reportingPeriod;
		},

		resizeTable: function(tableSapId) {
			var tableId = $('#' + tableSapId.sId);
			if (tableSapId.getRows().length == 0) {
				return;
			} else {
				var rowHeight = $('#' + tableSapId.getRows()[0].sId).height();
				var newNumberOfRows = 4;
				var spaceLeft = $(window).height() - (tableId.offset().top + tableId.height() + rowHeight * 2);
				var numberOfRows = tableSapId.getVisibleRowCount();
				if (Math.sign(spaceLeft)) { //IF EXTRA SPACE
					newNumberOfRows = numberOfRows + parseInt((spaceLeft / rowHeight), 10);
					if (newNumberOfRows < 4) {
						newNumberOfRows = 4;
					}
					tableSapId.setVisibleRowCount(newNumberOfRows);
				} else { // IF NEGATIVE SPACE
					if (numberOfRows > 4) {
						newNumberOfRows = numberOfRows - parseInt((spaceLeft / rowHeight), 10);
						if (newNumberOfRows < 4) {
							newNumberOfRows = 4;
						}
						tableSapId.setVisibleRowCount(newNumberOfRows);
					}
				}
			}
		}

	});
	return controller;
});