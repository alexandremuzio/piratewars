var respawnJSON = {
    id: "respawnDialogBox",
	component: "Window",
	image: "respawnDialogBox",
	header: { position: { x: 0, y: -40 }, height: 100, image: "/gui/assets/img/lvlcomplete.png", },
	padding: 4,
	position: { x: 200, y: 200 },
	anchor: { x: 0.5, y: 0.5 },
	width: 400,
	height: 300,
	layout: [1, 4],
	children: [
		{
			position: "center",
			text: "Respawns in",
			font: {
				size: "30px",
				family: "Skranji",
				color: "white"
			},
			width: 1,
			height: 1
		},
		{
			id: "respawnTime",
			position: "center",
			text: "10",
			font: {
				size: "50px",
				family: "Skranji",
				color: "white"
			},
			width: 1,
			height: 1
		},
		null
	]
};

module.exports = respawnJSON;