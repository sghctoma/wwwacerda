class Display {
    constructor(lacerda) {
        this.lacerda = lacerda;

        this.stage = new Konva.Stage({
            container: 'container',
            width: 380,
            height: 726
        });
        this.layer = new Konva.Layer();

        this.sources = {
            background: '/assets/background.png',
            startscreen: '/assets/startscreen.png',
            button_reveal: '/assets/button_reveal.png',
            button_next: '/assets/button_next.png',
            shuttle: '/assets/shuttle.png',
            shuttle_nogo: '/assets/shuttle_nogo.png',
            shuttle_go_left: '/assets/shuttle_go_left.png',
            shuttle_go_right: '/assets/shuttle_go_right.png'
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

    renderScreen() {
        this.layer.add(this.images.background);

        var state = this.lacerda.currentState();

        // status bar
        this.layer.add(this.labels.status);
        this.labels.status.text(
            "ROUND " +
            this.lacerda.currentRound + 
            " - " + 
            this.lacerda.currentPhase +
            " PHASE");

        // phase marker
        //TODO

        // mission marker
        if (state.mission == null) {
            //this.labels.mission.text('X');
            this.layer.add(this.shapes.inactive_mission);
        } else {
            //this.labels.mission.text(['A', 'B', 'C'][state.mission]);
            this.layer.add(this.shapes.active_mission);
        }
        this.layer.add(this.labels.mission);
        
        // buttons
        if (state.turnOrders != null) {
            this.layer.add(this.buttons.init_shuttle);
            this.layer.add(this.images.shuttle);
            this.layer.add(this.images.shuttle_go_left);
            this.layer.add(this.images.shuttle_go_right);
        } else {
            this.layer.add(this.buttons.next_round);
            this.layer.add(this.images.shuttle_nogo);
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
        this.images['shuttle'] = new Konva.Image({
            image: images.shuttle,
            x: this.stage.width() / 2 - images.shuttle.width / 2,
            y: 581,
        });
        this.images['shuttle_go_left'] = new Konva.Image({
            image: images.shuttle_go_left,
            x: 71,
            y: 587,
        });
        this.images['shuttle_go_right'] = new Konva.Image({
            image: images.shuttle_go_right,
            x: 260,
            y: 587,
        });
        this.images['shuttle_nogo'] = new Konva.Image({
            image: images.shuttle_nogo,
            x: this.stage.width() / 2 - images.shuttle_nogo.width / 2,
            y: 581,
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
            y: 94,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 16,
            text: '',
            fill: '#E5E5DE'
        });
        this.labels['action'] = new Konva.Text({
            x: 0,
            y: this.stage.height() / 2 + 20,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 62,
            text: '1',
            fill: 'white'
        });
        this.labels['mission'] = new Konva.Text({
            x: 0,
            y: 148,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 58,
            text: '/',
            fill: 'white'
        });
    }

    setupButtons(images) {
        // REVEAL START POSITION
        var label1 = new Konva.Text({
            x: 0,
            y: 24,
            width: images.button_reveal.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            padding: 1.5,
            text: 'REVEAL START POSITION',
            fill: '#24C5A3'
        });
        var image1 = new Konva.Image({
            image: images.button_reveal,
        });
        this.buttons['reveal'] = new Konva.Group({
            x: this.stage.width() / 2 - images.button_reveal.width / 2,
            y: 623,
        });
        this.buttons['reveal'].add(image1);
        this.buttons['reveal'].add(label1);
        this.buttons['reveal'].on('click tap', () => {
            this.revealStartPosition();
        });

        // FIRST ROUND
        var label2 = new Konva.Text({
            x: 0,
            y: 12,
            width: images.button_next.width - 9,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            padding: 1.5,
            text: 'FIRST ROUND',
            fill: '#0E4B47'
        });
        var image2 = new Konva.Image({
            image: images.button_next
        });
        this.buttons['first_round'] = new Konva.Group({
            x: this.stage.width() / 2 - images.button_next.width / 2 + 5,
            y: 635,
        });
        this.buttons['first_round'].add(image2);
        this.buttons['first_round'].add(label2);
        this.buttons['first_round'].on('click tap', () => {
            this.lacerda.nextState();
            this.layer.destroyChildren();
            this.renderScreen();
        });

        // NEXT ROUND
        var label3 = new Konva.Text({
            x: 0,
            y: 12,
            width: images.button_next.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            padding: 1.5,
            text: 'NEXT ROUND',
            fill: '#0E4B47'
        });
        var image3 = new Konva.Image({
            image: images.button_next
        });
        this.buttons['next_round'] = new Konva.Group({
            x: this.stage.width() / 2 - images.button_next.width / 2 + 5,
            y: 635,
        });
        this.buttons['next_round'].add(image3);
        this.buttons['next_round'].add(label3);
        this.buttons['next_round'].on('click tap', () => {
            alert('1337');
        });

        // INITIATE SHUTTLE PHASE
        var label4 = new Konva.Text({
            x: 0,
            y: 24,
            width: images.button_reveal.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            padding: 1.5,
            text: 'INITIATE SHUTTLE PHASE',
            fill: '#24C5A3'
        });
        var image4 = new Konva.Image({
            image: images.button_reveal
        });
        this.buttons['init_shuttle'] = new Konva.Group({
            x: this.stage.width() / 2 - images.button_reveal.width / 2,
            y: 623,
        });
        this.buttons['init_shuttle'].add(image4);
        this.buttons['init_shuttle'].add(label4);
        this.buttons['init_shuttle'].on('click tap', () => {
            alert('1338');
        });
    }

    setupShapes() {
        this.shapes['active_mission'] = new Konva.Circle({
            x: this.stage.width() / 2,
            y: 176,
            radius: 33,
            fill: '#cf4541',
        });
        this.shapes['inactive_mission'] = new Konva.Circle({
            x: this.stage.width() / 2,
            y: 176,
            radius: 33,
            fill: '#aaa9a2',
        });

        this.shapes['rect1'] = new Konva.Rect({ x: 17, y: 435, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.shapes['rect2'] = new Konva.Rect({ x: 17, y: 455, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.shapes['rect3'] = new Konva.Rect({ x: 17, y: 475, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.shapes['rect4'] = new Konva.Rect({ x: 17, y: 495, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.shapes['rect5'] = new Konva.Rect({ x: 17, y: 515, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.shapes['rect6'] = new Konva.Rect({ x: 17, y: 535, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });

        this.shapes['dark_square'] = new Konva.Rect({ y: 584, width: 27, height: 27, fill: '#1F867E' });
        this.shapes['light_square'] = new Konva.Rect({ y: 584, width: 27, height: 27, fill: '#619089' });
    }
}

