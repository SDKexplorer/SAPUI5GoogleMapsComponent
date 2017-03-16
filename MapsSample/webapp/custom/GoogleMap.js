var google;
sap.ui.define([
		"sap/ui/core/ComponentContainer"
	],

	function(ComponentContainer) {
		"use string";

		return ComponentContainer.extend("MapsSample.custom.GoogleMap", {
			map: "",

			model: {
				markers: []
			},

			metadata: {
				properties: {
			        width: {
			          type: 'sap.ui.core.CSSSize',
			          defaultValue: '500px'
			        },
					visibility: "visible",
					isRendered: {
						type: "boolean",
						defaultValue: false
					},
					nightMode: {
						type: "boolean",
						defaultValue: false
					},
					zoom: {
						type: "int",
						defaultValue: 2
					},
					center: {
						type: "object[]",
						defaultValue: [{
							lat : 0,
							lng : 0
						}]
					}
				},
				aggregation: {},
				events: {
					toLocation: {
						parameters: {
							longitude: {
								type: "double"
							},
							latitude: {
								type: "double"
							}
						}
					},
					addPin: {
						parameters: {
							longitude: {
								type: "double"
							},
							latitude: {
								type: "double"
							}
						}
					},
					getPins: {

					},
					getPin: {
						parameters: {
							id: {
								type: "string"
							}
						}
					},
					deletePin: {
						parameters: {
							id: {
								type: "string"
							}
						}
					},
					highlightPin: {
						
					},
					switchNightMode: {
						parameters: {
							isSet: {
								type: "boolean"
							}
						}
					}
				}
			},

			styles: [{
				elementType: 'geometry',
				stylers: [{
					color: '#242f3e'
				}]
			}, {
				elementType: 'labels.text.stroke',
				stylers: [{
					color: '#242f3e'
				}]
			}, {
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#746855'
				}]
			}, {
				featureType: 'administrative.locality',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#d59563'
				}]
			}, {
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#d59563'
				}]
			}, {
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{
					color: '#263c3f'
				}]
			}, {
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#6b9a76'
				}]
			}, {
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{
					color: '#38414e'
				}]
			}, {
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{
					color: '#212a37'
				}]
			}, {
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#9ca5b3'
				}]
			}, {
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{
					color: '#746855'
				}]
			}, {
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{
					color: '#1f2835'
				}]
			}, {
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#f3d19c'
				}]
			}, {
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [{
					color: '#2f3948'
				}]
			}, {
				featureType: 'transit.station',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#d59563'
				}]
			}, {
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{
					color: '#17263c'
				}]
			}, {
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#515c6d'
				}]
			}, {
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{
					color: '#17263c'
				}]
			}],

			onAfterRendering: function() {
				var id = this.getId();
				var map = this.renderMap(id);
				this._setComponentModel();
				this.attachMapEvents(map);
			},

			renderMap: function(id) {
				var that = this;
				var map = new google.maps.Map(document.getElementById(id), {
					center: {
						lat: that.getCenter()[0].lat,
						lng: that.getCenter()[0].lng
					},
					zoom: that.getZoom(),
					styles: that.getNightMode() ? this.styles : []
				});

				this._setMapsControl(map);

				if (this.getPins()) {
					that._renderPins();
				}
				return map;
			},
			
			highlightPin: function(marker){
				if(marker.getAnimation() !== google.maps.Animation.BOUNCE) {
			        marker.setAnimation(google.maps.Animation.BOUNCE);
			    } else {
			        marker.setAnimation(null);
			    }
			},

			attachMapEvents: function(map) {
				var sapComponent = this;
				map.addListener('center_changed', function(event) {
					sapComponent.getCenter()[0].lng = map.getCenter().lng();
					sapComponent.getCenter()[0].lat = map.getCenter().lat();
					return false;
				}, false);
				map.addListener('zoom_changed', function(event) {
					sapComponent.setZoom(map.getZoom());
					if(map.getZoom() < 1){
						sapComponent.setZoom(map.setZoom(1));
					}
					return false;
				}, false);
			},

			_getMapsControl: function() {
				return this.map;
			},

			_setMapsControl: function(control) {
				this.map = control;
			},

			_getComponent: function() {
				return this;
			},
			
			_getComponentModel: function(){
				return this.getComponent().getModel();
			},
			
			_setComponentModel: function(){
				var data = this.model;
				var model = new sap.ui.model.json.JSONModel(data);
				this._getComponent().setModel(model); 
			},

			addPin: function(longitude, latitude) {
				var latLng = {
					lat: latitude,
					lng: longitude
				};
				var marker = new google.maps.Marker({
					position: latLng,
					animation: google.maps.Animation.DROP,
					map: this._getMapsControl()
				});

				marker.addListener('rightclick', function(ev) {
					this.deletePin(marker.id);
					return false;
				}, false);

				marker.id = (new Date().getTime() + longitude + latitude);
				this.getPins().push(marker);
				this._setComponentModel();
			},
			
			getPins: function() {
				return this.model.markers;
			},

			getPin: function(id) {
				return this.model.markers[id];
			},
			
			navToPin: function(){
				
			},

			deletePin: function(id) {
				var pins = this.getPins();
				for (var i = 0; i < pins.length; i++) {
					if (pins[i] == id) {
						pins[i].setMap(null);
						pins.splice(i, 1);
						return;
					}
				}
				this._setComponentModel();
			},

			_renderPins: function() {
				var that = this;
				var pins = this.getPins();
				for (var i = 0; i < pins.length; i++) {
					pins[i].setMap(that._getMapsControl());
				}
			},

			switchNightMode: function(bool) {
				if (bool) {
					this._getMapsControl().setOptions({
						styles: this.styles
					});
				} else {
					this._getMapsControl().setOptions({
						styles: []
					});
				}
				this.setNightMode(bool);
			},

			renderer: function(oRm, oControl) {
				oRm.write("<div");
				oRm.writeControlData(oControl);
				oRm.addClass("sapUiSmallMarginBeginEnd");
				oRm.addClass("sapUiFullHeight");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("</div>");
			}

		});
	});