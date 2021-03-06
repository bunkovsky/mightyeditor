MT.extend("core.BasicTool").extend("core.Emitter")(
	MT.plugins.tools.Brush = function(tools){
		MT.core.BasicTool.call(this, tools);
		this.name = "brush";
	},{
		
		initUI: function(ui){
			MT.core.BasicTool.initUI.call(this, ui);
		},
		
		lastX: 0,
		lastY: 0,
		
		init: function(asset){
			this.tools.unselectObjects();
			asset = asset || this.tools.activeAsset;
			if(!asset){
				return;
			}
			
			console.log("init brush");
			if(asset.contents){
				return;
			}
			this.tools.initActiveObject(asset);
			this.tools.setTool(this);
			
			var that = this;
			this.tools.map.handleMouseMove = function(e){
				that.mouseMove(e);
			}
		},
		
		
		mouseDown: function(e){
			
			if(!this.tools.activeObject){
				if(!this.tools.map.activeObject){
					return;
				}
				if(!this.tools.lastAsset){
					this.tools.lastAsset = this.project.plugins.assetsmanager.getById(this.tools.map.activeObject.MT_OBJECT.assetId);
				}
				this.init(this.tools.lastAsset);
				return;
			}
			
			var om = this.project.plugins.objectsmanager;
			
			this.tools.map.sync(this.tools.activeObject);
			
			om.insertObject(this.tools.activeObject.MT_OBJECT);
			
			this.lastX = this.tools.activeObject.x;
			this.lastY = this.tools.activeObject.y;
			
			this.tools.initActiveObject();
		},
		
		mouseMove: function(e){
			
			if(e.target != this.tools.map.game.canvas){
				return;
			}
			
			var x = this.tools.activeObject.x;
			var y = this.tools.activeObject.y;
			
			this.tools.map._followMouse(e, true);
			
			if(this.ui.events.mouse.down){
				
				if(this.tools.activeObject.x != this.lastX || this.tools.activeObject.y != this.lastY){
					
					console.log("ADD brush");
					
					var om = this.project.plugins.objectsmanager;
					this.tools.map.sync(this.tools.activeObject, this.tools.activeObject.MT_OBJECT);
					om.insertObject(this.tools.activeObject.MT_OBJECT);
					
					this.lastX = this.tools.activeObject.x;
					this.lastY = this.tools.activeObject.y;
					this.tools.initActiveObject();
				}
			}
		},
		
		mouseUp: function(e){
			console.log("upp", e);
			
		},
		
		
		deactivate: function(){
			
			if(this.tools.activeObject){
				this.tools.map.removeObject(this.tools.activeObject);
				this.tools.activeObject = null;
				this.tools.lastAsset = null;
			}
			
			
			this.tools.map.handleMouseMove = this.tools.map.emptyFn;
			this.project.plugins.objectsmanager.update();
		},
		
		

	}
);