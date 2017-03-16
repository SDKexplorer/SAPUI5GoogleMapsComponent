sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("MapsSample.controller.View1", {

		onAfterRendering: function() {
			this.populateList();
		},

		toggleNightMode: function(event) {
			this.byId("map").setNightMode(event.getSource().getState());
		},

		populateList: function() {
			var map = this.byId("map");
			map.addPin(4, 7);
			map.addPin(7, 88);

			var list = this.byId("myList");
			var listItem = new sap.m.ActionListItem({
				text: "{id}"
			});
			var model = map.getModel();
			list.setModel(model);
			list.bindItems("/markers", listItem);
		},

		actionsOnItem: function(event) {
			var that = this;
			var controller = this.getView().getController();
			var binding = event.getParameter("listItem").getBindingContext();
			var model = binding.getModel();
			var path = binding.getPath();
			var marker = model.getProperty(path);
			
			that.createPopover(marker).openBy(event.getSource());

		},
		
		createPopover: function(marker){
			if(sap.ui.getCore().byId("myPopover")){
				return sap.ui.getCore().byId("myPopover").data("marker", marker).close();
			} else {
				return new sap.m.ResponsivePopover("myPopover", {
					content: [
						new sap.m.Button({
							text: "Delete",
							press: this.deleteItem.bind(this)
						}),
						new sap.m.Button({
							text: "Highlight",
							press: this.highlightItem.bind(this)
						})
					]
				}).data("marker", marker);
			}
		},
		
		deleteItem: function(event) {
			var map = this.byId("map");
			map.deletePin(event.getSource().getParent().data("marker"));
			event.getSource().getParent().close();
			this.updateBinding();
		},

		highlightItem: function(event) {
			var map = this.byId("map");
			map.highlightPin(event.getSource().getParent().data("marker"));
		},

		updateBinding: function() {
			var map = this.byId("map");
			var list = this.byId("myList");
			var listItem = new sap.m.ActionListItem({
				text: "{id}"
			});
			var model = map.getModel();
			list.setModel(model);
			list.bindItems("/markers", listItem);
		},

		addItem: function() {
			var lat = parseFloat(this.byId("lat").getValue());
			var lng = parseFloat(this.byId("lng").getValue());
			this.byId("map").addPin(lng, lat);

			var map = this.byId("map");
			var list = this.byId("myList");
			var listItem = new sap.m.ActionListItem({
				text: "{id}"
			});
			var model = map.getModel();
			list.setModel(model);
			list.bindItems("/markers", listItem);
		}

	});
});
