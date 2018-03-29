({
	navigate: function(cmp, cmpName, recordId, state) {
		var config = cmp.get("v.componentConfig");
		if(config && (config.cmpName !== cmpName || config.params.recordId !== recordId)){
			this.pushToHistoryStack(cmp, config.cmpName, config.params);
		} 
		var params = { recordId: recordId, state: state || {} };
		this.setCurrentComponent(cmp, cmpName, params);
	},
	navigateBack: function(cmp, state) {
		var config = this.popFromHistoryStack(cmp);
		if(config) {
			if(state) this.extend(config.params.state, state);
			this.setCurrentComponent(cmp, config.cmpName, config.params); 
		}
	},
	setCurrentComponent: function(cmp, cmpName, params){
		this.log(cmp, "Navigating to " + cmpName, params);
		this.createComponent(cmpName, params).then((newCmp) => {
			var oldCmp = cmp.get("v.componentInstance");
			if(oldCmp && oldCmp.destroy) oldCmp.destroy(); 
			cmp.set("v.componentName", cmpName);
			cmp.set("v.componentConfig", { cmpName: cmpName, params: params });
			cmp.set("v.componentInstance", newCmp);
		});
	},
	pushToHistoryStack: function(cmp, cmpName, params){
		var cmpsHistroyStack = cmp.get("v.componentsHistroyStack") || [];
		cmpsHistroyStack.push({ cmpName: cmpName, params: params });
		cmp.set("v.componentsHistroyStack", cmpsHistroyStack);
	},
	popFromHistoryStack: function(cmp){
		var cmpsHistroyStack = cmp.get("v.componentsHistroyStack") || [];
		var previousCmp = cmpsHistroyStack.pop();
		cmp.set("v.componentsHistroyStack", cmpsHistroyStack);
		return previousCmp;
	},

	//data service
	dataService: null, dataServicePromise: null,
	initDataService: function(cmp){
		if(this.dataService) return this.deferredWithValue(this.dataService);
		if(this.dataServicePromise) return this.dataServicePromise;
    	this.log(cmp, "Initiating Data Service");
    	return this.dataServicePromise = this.createComponent("DataService", {})
    	.then((newCmp) => { this.dataServicePromise = null; return this.dataService = newCmp; });
	}
})