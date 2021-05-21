var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
			player,
			FUNCTIONS,
			BUYABLES,
			UPGRADES,
			AUTOS,
			TABS,
            format,
        }
	})
}