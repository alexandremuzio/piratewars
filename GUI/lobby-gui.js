var LobbyJSON = {
    id: 'lobby',
    component: 'Window',
    header: { position: { x: 0, y: 0 }, height: 40, text: 'Viking Wars' },
    draggable: false,
    width: 800,
    height: 450,
    // padding: 10,

    layout: [1, 2],
    children: [
        {
            component: 'Layout',
            skin:'List',
            position: {x: 0, y: 30},
            width: 750,
            height: 300,
            layout: [3, 1],
            children: [
                {
                    component: 'Layout',
                    width: 320,
                    height: 300,
                    position: 'center',
                    layout: [1, 5],
                    children: [
                        { id: 'redslot1', text: 'Slot 1', position: 'center', width: 320, height: 60 },
                        { id: 'redslot2', text: 'Slot 2', position: 'center', width: 320, height: 60 },
                        { id: 'redslot3', text: 'Slot 3', position: 'center', width: 320, height: 60 },
                        { id: 'redslot4', text: 'Slot 4', position: 'center', width: 320, height: 60 },
                        { id: 'redslot5', text: 'Slot 5', position: 'center', width: 320, height: 60 }
                      ]
                },

                {
                    id: 'switchTeamButton',
                    text: 'Switch',
                    font: {
                        size: '16px',
                        family: 'Skranji',
                        color: 'red'
                    },
                    component: 'Button',
                    position: 'center',
                    width: 100,
                    height: 40
                },

                {
                    component: 'Layout',
                    width: 320,
                    height: 300,
                    position: 'center',
                    layout: [1, 5],
                    children: [
                        { id: 'blueslot1', text: 'Slot 1', position: 'center', width: 320, height: 60 },
                        { id: 'blueslot2', text: 'Slot 2', position: 'center', width: 320, height: 60 },
                        { id: 'blueslot3', text: 'Slot 3', position: 'center', width: 320, height: 60 },
                        { id: 'blueslot4', text: 'Slot 4', position: 'center', width: 320, height: 60 },
                        { id: 'blueslot5', text: 'Slot 5', position: 'center', width: 320, height: 60 }
                    ]
                }
            ]
        },

        {
            id: 'readyButton',
            component: 'Button',
            font: {
                size: '16px',
                family: 'Skranji',
                color: 'red'
            },
            position: 'center',
            text: 'Ready',
            width: 300,
            height: 50
        }
    ]
};

module.exports = LobbyJSON;