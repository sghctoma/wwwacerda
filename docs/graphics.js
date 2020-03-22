class Display {
    constructor(lacerda) {
        this.lacerda = lacerda;
        this.width = 845;
        this.height = 1515;

        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height,
        });
        this.layer = new Konva.Layer();

        this.sources = {
            // start screen
            startscreen: '/assets/startscreen.png',
            reveal_start: '/assets/buttons/reveal-start-position.png',
            reveal_start_pressed: '/assets/buttons/reveal-start-position_pressed.png',
            first_round: '/assets/buttons/round-one.png',
            first_round_pressed: '/assets/buttons/round-one_pressed.png',

            // general
            background: '/assets/background.png',
            backbutton: '/assets/buttons/backbutton.png',

            // colonization phase; travel
            shuttle: '/assets/shuttle-icon-centered@3x.png',
            travel_arrows: '/assets/travel-arrows-left-right@3x.png',
            shuttle_phase_indicator: '/assets/shuttle-phase-graphical-indicator@3x.png',
            init_shuttle: '/assets/buttons/initiate-shuttle-phase.png',
            init_shuttle_pressed: '/assets/buttons/initiate-shuttle-phase_pressed.png',
            
            // colonization phase; no travel
            shuttle_nogo: '/assets/no-travel-icon@3x.png',
            next_round: '/assets/buttons/next-round.png',
            next_round_pressed: '/assets/buttons/next-round_pressed.png',
            colonization_phase_indicator: '/assets/2@3x.png',

            // grid randomizer
            hex_bottom_left_down:   '/assets/grid/bottom_left-down.png',
            hex_bottom_left_up:     '/assets/grid/bottom_left-up.png',
            hex_bottom_right_down:  '/assets/grid/bottom_right_down.png',
            hex_bottom_right_up:    '/assets/grid/bottom_right-up.png',
            hex_left_down:          '/assets/grid/left-down.png',
            hex_left_up:            '/assets/grid/left-up.png',
            hex_right_down:         '/assets/grid/right-down.png',
            hex_right_up:           '/assets/grid/right-up.png',
            hex_top_left_down:      '/assets/grid/top_left-down.png',
            hex_top_left_up:        '/assets/grid/top_left-up.png',
            hex_top_right_down:     '/assets/grid/top_right-down.png',
            hex_top_right_up:       '/assets/grid/top_right-up.png',

            // card randomizer
            rnd_card_1: '/assets/card/random-card-display-hd-spot-1@3x.png',
            rnd_card_2: '/assets/card/random-card-display-hd-spot-2@3x.png',
            rnd_card_3: '/assets/card/random-card-display-hd-spot-3@3x.png',
            rnd_card_4: '/assets/card/random-card-display-hd-spot-4@3x.png',
            rnd_card_5: '/assets/card/random-card-display-hd-spot-5@3x.png',
            rnd_card_6: '/assets/card/random-card-display-hd-spot-6@3x.png',

            // tech randomizer
            rnd_tech_1: '/assets/tech/1-middle-up.png',
            rnd_tech_2: '/assets/tech/2-middle-down.png',
            rnd_tech_3: '/assets/tech/3-bottom-up.png',
            rnd_tech_4: '/assets/tech/4-top-down.png',
        };
        
        this.labels = {};
        this.shapes = {};
        this.images = {};
        this.buttons = {};

        this.setupLabels();
        this.setupShapes();
        this.loadImages();
    }

    renderStartScreen() {
        this.layer.add(this.images.startscreen);
        this.layer.add(this.buttons['reveal']);
        this.stage.add(this.layer);
    }

    revealStartPosition() {
    	var posLacerda = lacerda.startPositions[0];
    	var offset = (posLacerda < 4 ? 82 : 493);
    	var color;
    	for (var i = 0; i < 4; ++i) {
    		if (posLacerda % 4 == i) {
    			color = '#1f8d7b';
    		} else {
    			color = '#969693';
    		}
    		this.layer.add(new Konva.Rect({
    			x: offset + i * 72,
    			y: 1257,
    			width: 54,
    			height: 54,
    			fill: color,
    		}));
    	}

    	var pentagon_x = posLacerda < 4 ? 217 : 629
    	this.layer.add(new Konva.RegularPolygon({
	        x: pentagon_x,	
	        y: 1168,
	        sides: 5,
	        radius: 50,
	        stroke: '#1f8d7b',
	        strokeWidth: 4,
	    }));

		var startpos_x = offset + (posLacerda % 4) * 72 + 27;
    	this.layer.add(new Konva.Line({
    		points: [
    			pentagon_x, 1210,
    			pentagon_x, 1225,
    			startpos_x, 1225,
    			startpos_x, 1257],
    		stroke: '#1f8d7b',
    		strokeWidth: 2,
    	}));
	    
        this.buttons.reveal.hide();
        this.layer.add(this.buttons.first_round);
        
        this.layer.draw();
    }

    setupLayer() {
        this.layer.add(this.images.background);
        this.layer.add(this.buttons.backbutton);
        this.layer.add(this.labels.status);
        this.layer.add(this.images.colonization_phase_indicator);
        this.layer.add(this.images.shuttle_phase_indicator);
        this.layer.add(this.shapes.active_mission);
        this.layer.add(this.labels.mission);
        this.layer.add(this.labels.action);

        this.layer.add(this.images.card_random);
        this.layer.add(this.images.grid_random);
        this.layer.add(this.images.tech_random);

        this.layer.add(this.shapes.turnorder_pointer);
        this.layer.add(this.shapes.turnorder_circle);
        for (var i = 0; i < 4; ++i) {
        	this.layer.add(this.shapes.turnorder_squares[i]);
        }

        this.layer.add(this.buttons.init_shuttle);
        this.layer.add(this.images.shuttle);
        this.layer.add(this.images.travel_arrows);

        this.layer.add(this.buttons.next_round);
        this.layer.add(this.images.shuttle_nogo);
    }

    renderScreen() {
        var state = this.lacerda.currentState();

        // status bar
        this.labels.status.text(
            "ROUND " +
            this.lacerda.currentRound + 
            " - " + 
            this.lacerda.currentPhase +
            " PHASE");

        // phase indicator
        if (this.lacerda.currentPhase == 'COLONISATION' && state.turnOrders != null) {
            this.images.colonization_phase_indicator.show();
            this.images.shuttle_phase_indicator.hide();
        } else {
            this.images.colonization_phase_indicator.hide();
            this.images.shuttle_phase_indicator.show();
        }

        // mission marker
        if (state.mission != null) {
            this.labels.mission.text(['A', 'B', 'C'][state.mission-1]);
            this.shapes.active_mission.show();
        } else {
            this.labels.mission.text('');
            this.shapes.active_mission.hide();
        }

        // card tiebreaker
        this.images.card_random.image(
        	this.images.card_random_src[state.cardTiebreaker]);

        // current action
        this.labels.action.text(state.action);

        // tech tiebreaker
        this.images.tech_random.image(
        	this.images.tech_random_src[state.techTiebreaker]);

        // turn order
        if (this.lacerda.currentPhase == 'SHUTTLE') {
            this.shapes.turnorder_pointer.points([
                315 + 72 * state.turnOrders[0], 1257,
                315 + 72 * state.turnOrders[0], 1241,
                315 + 72 * state.turnOrders[0] + (state.turnOrders[0] < 2 ? 74 : -74), 1186,
            ]);
            this.shapes.turnorder_pointer.show();
            this.shapes.turnorder_circle.x(
                315 + 72 * state.turnOrders[0] + (state.turnOrders[0] < 2 ? 77 : -77));
            this.shapes.turnorder_circle.show();

        	for (var i = 0; i < 4; ++i) {
        		if (i == state.turnOrders[0]) {
        			this.shapes.turnorder_squares[i].fill('#1f8d7b');
        		} else if (i == state.turnOrders[1]) {
        			this.shapes.turnorder_squares[i].fill('#588c83');
        		} else {
        			this.shapes.turnorder_squares[i].fill('#969693');
        		}
        		this.shapes.turnorder_squares[i].show();
        	}
        } else {
            this.shapes.turnorder_pointer.hide();
            this.shapes.turnorder_circle.hide();
        	for (var i = 0; i < 4; ++i) {
        		this.shapes.turnorder_squares[i].hide();
        	}
        }

        // hex tiebreaker
        var g = this.images.grid_random_src[state.hexTiebreaker]; 
        this.images.grid_random.image(g.image);
        this.images.grid_random.x(g.x);
        this.images.grid_random.y(g.y);

        // buttons
        if (this.lacerda.currentPhase == 'SHUTTLE') {
            this.buttons.init_shuttle.hide();
            this.images.shuttle.hide();
            this.images.travel_arrows.show();

            this.buttons.next_round.show();
        } else if (state.turnOrders != null) {
            this.buttons.init_shuttle.show();
            this.images.shuttle.show();
            this.images.travel_arrows.show();
            this.buttons.next_round.hide();
            this.images.shuttle_nogo.hide();
        } else {
            this.buttons.init_shuttle.hide();
            this.images.shuttle.hide();
            this.images.travel_arrows.hide();
            this.buttons.next_round.show();
            this.images.shuttle_nogo.show();
        }

        this.layer.draw();
    }

    imagesLoaded(images) {
        this.images['startscreen'] = new Konva.Image({
            image: images.startscreen,
        });
        this.images['background'] = new Konva.Image({
            image: images.background,
        });
        this.images['colonization_phase_indicator'] = new Konva.Image({
            x: this.width/2 - images.colonization_phase_indicator.width/2,
            y: 195,
            image: images.colonization_phase_indicator,
        });
        this.images['shuttle_phase_indicator'] = new Konva.Image({
            x: this.width/2 - images.shuttle_phase_indicator.width/2,
            y: 195,
            image: images.shuttle_phase_indicator,
        });
        this.images['shuttle'] = new Konva.Image({
            image: images.shuttle,
            x: this.width/2 - images.shuttle.width/2,
            y: 1242,
        });
        this.images['travel_arrows'] = new Konva.Image({
            image: images.travel_arrows,
            x: this.width/2 - images.travel_arrows.width/2,
            y: 1264,
        });
        this.images['shuttle_nogo'] = new Konva.Image({
            image: images.shuttle_nogo,
            x: this.width/2 - images.shuttle_nogo.width/2,
            y: 1250,
        });

        this.images['card_random'] = new Konva.Image({ x: 24, y: 842 });
        this.images['card_random_src'] = [];
        for (var i = 0; i < 6; i++) {
        	this.images['card_random_src'][i] = images['rnd_card_'+(i+1)];
        }
        
        this.images['tech_random'] = new Konva.Image({ x: 732, y: 963 });
        this.images['tech_random_src'] = [];
        for (var i = 0; i < 4; i++) {
        	this.images['tech_random_src'][i] = images['rnd_tech_'+(i+1)];
        }

        this.images['grid_random'] = new Konva.Image();
        this.images['grid_random_src'] = [
            { image: images.hex_bottom_left_down, x: 36, y: 750 },
            { image: images.hex_bottom_left_up, x: 107, y: 848 },
            { image: images.hex_bottom_right_down, x: 496, y: 741 },
            { image: images.hex_bottom_right_up, x: 373, y: 849 },
            { image: images.hex_left_down, x: 3, y: 507 },
            { image: images.hex_left_up, x: 3, y: 624 },
            { image: images.hex_right_down, x: 685, y: 506 },
            { image: images.hex_right_up, x: 685, y: 624 },
            { image: images.hex_top_left_down, x: 107, y: 370},
            { image: images.hex_top_left_up, x: 28, y: 435 },
            { image: images.hex_top_right_down, x: 370, y: 369 },
            { image: images.hex_top_right_up, x: 496, y: 435 },
        ];

        // call this from here because we need the images for the buttons
        this.setupButtons(images);

        this.renderStartScreen();
    }
    
    loadImages() {
        var images = {};
        var loadedImages = 0;
        var numImages = Object.keys(this.sources).length;

        for (var src in this.sources) {
            images[src] = new Image();
            images[src].onload = () => {
                if (++loadedImages >= numImages) {
                    this.imagesLoaded(images);
                }
            };
            images[src].src = this.sources[src];
        }
    }

    setupLabels() {
        this.labels['status'] = new Konva.Text({
            x: 0,
            y: 127,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 36,
            text: '',
            fill: '#E5E5DE'
        });
        this.labels['action'] = new Konva.Text({
            x: 0,
            y: 788, 
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 147,
            text: '1',
            fill: 'white'
        });
        this.labels['mission'] = new Konva.Text({
            x: 0,
            y: 265,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 108,
            text: '',
            fill: 'white'
        });
    }

    setupButtons(images) {

    	// Need this, otherwise when you touch the button, move your finger
    	// (as if you were trying to drag the button), and release it outside
    	// the button areak, it would remain "pressed".
    	this.layer.on('touchend', () => {
        	this.buttons['reveal'].image(images.reveal_start);
        	this.buttons['first_round'].image(images.first_round);
        	this.buttons['next_round'].image(images.next_round);
        	this.buttons['init_shuttle'].image(images.init_shuttle);
        	this.layer.draw();
        });

        // REVEAL START POSITION
        this.buttons['reveal'] = new Konva.Image({
            image: images.reveal_start,
            x: this.width/2 - images.reveal_start.width/2,
            y: 1330,
        });
        this.buttons['reveal'].on('mouseover touchstart', () => {
        	this.buttons['reveal'].image(images.reveal_start_pressed);
        	this.layer.draw();
        });
        this.buttons['reveal'].on('mouseout', () => {
        	this.buttons['reveal'].image(images.reveal_start);
        	this.layer.draw();
        });
        this.buttons['reveal'].on('mouseup touchend', () => {
        	this.revealStartPosition();
        });

        // FIRST ROUND
        this.buttons['first_round'] = new Konva.Image({
            image: images.first_round,
            x: this.width/2 - images.first_round.width/2,
            y: 1361,
        });
        this.buttons['first_round'].on('mouseover touchstart', () => {
        	this.buttons['first_round'].image(images.first_round_pressed);
        	this.layer.draw();
        });
        this.buttons['first_round'].on('mouseout', () => {
        	this.buttons['first_round'].image(images.first_round);
        	this.layer.draw();
        });
        this.buttons['first_round'].on('mouseup touchend', () => {
        	this.layer.destroyChildren();
            this.setupLayer();

            this.lacerda.nextState();
            this.renderScreen();
        });

        // BACK
        this.buttons['backbutton'] = new Konva.Image({
            image: images.backbutton,
        });
        this.buttons['backbutton'].on('click tap', () => {
            this.lacerda.prevState();
            this.renderScreen();
        });

        // NEXT ROUND
        this.buttons['next_round'] = new Konva.Image({
            image: images.next_round,
            x: this.width/2 - images.next_round.width/2,
            y: 1361,
        });
        this.buttons['next_round'].on('mouseover touchstart', () => {
        	this.buttons['next_round'].image(images.next_round_pressed);
        	this.layer.draw();
        });
        this.buttons['next_round'].on('mouseout', () => {
        	this.buttons['next_round'].image(images.next_round);
        	this.layer.draw();
        });
        this.buttons['next_round'].on('mouseup touchend', () => {
        	this.lacerda.nextState();
            this.renderScreen();
        });

        // INITIATE SHUTTLE PHASE
        this.buttons['init_shuttle'] = new Konva.Image({
            image: images.init_shuttle,
            x: this.width/2 - images.init_shuttle.width/2,
            y: 1330,
        });
        this.buttons['init_shuttle'].on('mouseover touchstart', () => {
        	this.buttons['init_shuttle'].image(images.init_shuttle_pressed);
        	this.layer.draw();
        });
        this.buttons['init_shuttle'].on('mouseout', () => {
        	this.buttons['init_shuttle'].image(images.init_shuttle);
        	this.layer.draw();
        });
        this.buttons['init_shuttle'].on('mouseup touchend', () => {
        	this.lacerda.currentPhase = 'SHUTTLE';
            this.renderScreen();
        });
    }

    setupShapes() {
        this.shapes['active_mission'] = new Konva.Circle({
            x: 0.5 * this.width, //0.409 + 0.091 
            y: 0.158 * this.height + 0.091 * this.width,
            radius: 0.091 * this.width,
            fill: '#cf4541',
        });

        this.shapes['turnorder_squares'] = [
        	new Konva.Rect({ x: 288, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 360, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 432, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 504, y: 1257, width: 54, height: 54 }),
        ];

        this.shapes['turnorder_circle'] = new Konva.Circle({
            y: 1183,
            radius: 5,
            stroke: '#1f8d7b',
            strokeWidth: 1,
        });
        this.shapes['turnorder_pointer'] = new Konva.Line({
                points: [
                    315+144, 1257,
                    315+144, 1241,
                    241+144, 1186,
                ],
    		stroke: '#1f8d7b',
    		strokeWidth: 1,
        });

        // XXX I'll leave this here in case I ever decide to do the hex tiebreaker programatically...
        /*
        this.shapes['hexes'] = [
            new Konva.RegularPolygon({ sides: 6, radius: 34, rotation: 30, fill: '#097a6d' }),
            new Konva.RegularPolygon({ sides: 6, radius: 34, rotation: 30, fill: '#588c83' }),
            new Konva.RegularPolygon({ sides: 6, radius: 34, rotation: 30, fill: '#839e97' }),
            new Konva.RegularPolygon({ sides: 6, radius: 34, rotation: 30, fill: '#909b96' }),
        ];
        */
    }
}
