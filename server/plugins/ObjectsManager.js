MT.require("core.FS");

MT.extend("core.SocketManager")(
	MT.plugins.ObjectsManager = function(socket, project){
		MT.core.SocketManager.call(this, socket, "ObjectsManager");
		this.project = project;
		
		this.fs = MT.core.FS;
		
		var that = this;
		this.data = this.project.db.get("objects");
		
	},
	{
		readData: function(){
			this.a_sendData();
		},
		a_sendData: function(){
			this.sendMyGroup("receive", this.data.contents);
		},
		
		a_updateData: function(data){
			this.addIndices(data);
			this.data.contents = data;
			this.project.db.save();
			this.a_sendData();
			
			this.project.export.phaserDataOnly();
		},
		
		addIndices: function(data){
			
			for(var i=0; i<data.length; i++){
				if(data[i].id == void(0)){
					this.data.count++;
					data[i].id = this.data.count;
					
				}
				
				if(data[i].contents){
					this.addIndices(data[i].contents);
					continue;
				}
				
			}
			
			
		}
	}
);
