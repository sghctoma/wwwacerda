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
            init_shuttle: '/assets/shuttlephasebutton-hd@3x.png',
            first_round: '/assets/first-round-button-hd@3x.png',

            // general
            background: '/assets/background.png',
            backbutton: '/assets/backbutton@3x.png',

            // colonization phase
            colonization_phase_indicator: '/assets/2@3x.png',

            // colonization phase; travel
            shuttle: '/assets/shuttle-icon-centered@3x.png',
            travel_arrows: '/assets/travel-arrows-left-right@3x.png',
            shuttle_phase_indicator: '/assets/shuttle-phase-graphical-indicator@3x.png',
            
            // colonization phase; no travel
            shuttle_nogo: '/assets/no-travel-icon@3x.png',
            next_round: '/assets/next-round-button-hd@3x.png',

            // shuttle phase
            shuttle_phase_button: '/assets/initiateshuttlephasebutton@3x.png',
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
        this.shapes.dark_square.x(38+posLacerda*33+46*Math.floor(posLacerda/4));
        this.layer.add(this.shapes.dark_square);
        
        var posPlayer = lacerda.startPositions[1];
        this.shapes.light_square.x(38+posPlayer*33+46*Math.floor(posPlayer/4));
        this.layer.add(this.shapes.light_square);

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

        // phase marker
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

        // current action
        this.labels.action.text(state.action);
        
        // buttons
        if (this.lacerda.currentPhase == 'SHUTTLE') {
            this.buttons.init_shuttle.hide();
            this.images.shuttle.hide();
            this.images.travel_arrows.show();
            //XXX show turn order
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
            x: 0.202 * this.width,
            y: 0.129 * this.height,
            image: images.colonization_phase_indicator,
        });
        this.images['shuttle_phase_indicator'] = new Konva.Image({
            x: 0.202 * this.width,
            y: 0.129 * this.height,
            image: images.shuttle_phase_indicator,
        });
        this.images['shuttle'] = new Konva.Image({
            image: images.shuttle,
            //XXX x: 0.457 * this.width, downloaded image dimensions does not match assets in Zeplin 
            //XXX y: 0.83 * this.height, downloaded image dimensions does not match assets in Zeplin 
            x: 0.457 * this.width,
            y: 0.82 * this.height,
        });
        this.images['travel_arrows'] = new Konva.Image({
            image: images.travel_arrows,
            x: 0.183 * this.width,
            y: 0.834 * this.height,
        });
        this.images['shuttle_nogo'] = new Konva.Image({
            image: images.shuttle_nogo,
            x: 0.454 * this.width,
            y: 0.825 * this.height,
        });

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
            y: 0.084 * this.height,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 36,
            text: '',
            fill: '#E5E5DE'
        });
        this.labels['action'] = new Konva.Text({
            x: 0,
            y: 0.52 * this.height, 
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 147,
            text: '1',
            fill: 'white'
        });
        this.labels['mission'] = new Konva.Text({
            x: 0,
            y: 0.175 * this.height,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 108,
            text: '',
            fill: 'white'
        });
    }

    setupButtons(images) {
        // REVEAL START POSITION
        this.buttons['reveal'] = new Konva.Image({
            image: images.init_shuttle,
            //XXX x: 0.224 * this.width, downloaded image dimensions does not match assets in Zeplin 
            x: this.width/2 - images.init_shuttle.width/2,
            y: 0.888 * this.height,
        });
        this.buttons['reveal'].on('click tap', () => {
            this.revealStartPosition();
        });

        // FIRST ROUND
        this.buttons['first_round'] = new Konva.Image({
            image: images.first_round,
            //XXX x: 0.265 * this.width, downloaded image dimensions does not match assets in Zeplin 
            x: this.width/2 - images.first_round.width/2,
            y: 0.902 * this.height,
        });
        this.buttons['first_round'].on('click tap', () => {
            this.layer.destroyChildren();
            this.setupLayer();

            this.lacerda.nextState();
            this.renderScreen();
        });

        // BACK
        this.buttons['backbutton'] = new Konva.Image({
            image: images.backbutton,
            x: 0.057 * this.width,
            y: 0.016 * this.height,
        });
        this.buttons['backbutton'].on('click tap', () => {
            this.lacerda.prevState();
            this.renderScreen();
        });

        // NEXT ROUND
        this.buttons['next_round'] = new Konva.Image({
            image: images.next_round,
            //XXX x: 0.252 * this.width, downloaded image dimensions does not match assets in Zeplin 
            x: this.width/2 - images.next_round.width/2,
            y: 0.901 * this.height,
        });
        this.buttons['next_round'].on('click tap', () => {
            this.lacerda.nextState();
            this.renderScreen();
        });

        // INITIATE SHUTTLE PHASE
        this.buttons['init_shuttle'] = new Konva.Image({
            image: images.shuttle_phase_button,
            //XXX x: 0.224 * this.width, downloaded image dimensions does not match assets in Zeplin
            x: this.width/2 - images.shuttle_phase_button.width/2,
            y: 0.888 * this.height,
        });
        this.buttons['init_shuttle'].on('click tap', () => {
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
        
        this.shapes['dark_square'] = new Konva.Rect({ y: 584, width: 27, height: 27, fill: '#1F867E' });
        this.shapes['light_square'] = new Konva.Rect({ y: 584, width: 27, height: 27, fill: '#619089' });
    }
}

