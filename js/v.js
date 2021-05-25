var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
			player,
			FUNCTIONS,
			BUYABLES,
			UPGRADES,
			CHALLENGES,
			AUTOS,
			TABS,
            format,
        }
	})
}