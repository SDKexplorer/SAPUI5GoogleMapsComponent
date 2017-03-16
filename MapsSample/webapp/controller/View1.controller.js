sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"MapsSample/controller/BaseController"
], function(Controller, BaseController) {
	"use strict";

	return Controller.extend("MapsSample.controller.View1", {
	
	onAfterRendering:function(){
		BaseController.prototype.onInit.call(this);
		this.populateList();
	},
	
	toggleNightMode: function(event){
		this.byId("map").setNightMode(event.getSource().getState());
	},
	
	populateList: function(){
		var map = this.byId("map");
		map.addPin(0,0);
		map.addPin(22,1);
		map.addPin(5,5);
		map.addPin(3,77);
		var list = this.byId("myList");
		var listItem = new sap.m.ActionListItem({text: "{id}" });
		var model = map.getModel();
		list.setModel(model);
		list.bindItems("/markers",listItem);
	},
	
	deleteItem: function(event){
		var binding = event.getParameter("listItem").getBindingContext(); 
		var model = binding.getModel(); 
		var path = binding.getPath(); 
		var marker = model.getProperty(path);
		
		var map = this.byId("map");
		map.highlightPin(marker);

		var list = this.byId("myList");
		var listItem = new sap.m.ActionListItem({text: "{id}"});
		var model = map.getModel();
		list.setModel(model);
		list.bindItems("/markers",listItem);
	},
	
	addItem: function(){
		var lat = parseFloat(this.byId("lat").getValue());
		var lng = parseFloat(this.byId("lng").getValue());
		this.byId("map").addPin(lng, lat);    

		var map = this.byId("map");
		var list = this.byId("myList");
		var listItem = new sap.m.ActionListItem({text: "{id}"});
		var model = map.getModel();
		list.setModel(model);
		list.bindItems("/markers",listItem);
	}

	});
});