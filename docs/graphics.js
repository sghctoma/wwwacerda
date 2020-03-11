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
            startscreen: '/assets/startscreen.png',
            button_reveal: '/assets/button_reveal.png',
            button_next: '/assets/button_next.png',

            background: '/assets/background.png',
            init_shuttle: '/assets/init_shuttle.png',
            shuttle: '/assets/shuttle.png',
            next_round: '/assets/next_round.png',
        };
        this.labels = {};
        this.shapes = {};
        this.images = {};

        this.setupLabels();
        this.setupShapes();
        this.loadImages();
    }

    renderStartScreen() {
        this.images.button_reveal.on('click', () => {
            var posLacerda = lacerda.startPositions[0];
            this.shapes.dark_square.x(38+posLacerda*33+46*Math.floor(posLacerda/4));
            this.layer.add(this.shapes.dark_square);
            
            var posPlayer = lacerda.startPositions[1];
            this.shapes.light_square.x(38+posPlayer*33+46*Math.floor(posPlayer/4));
            this.layer.add(this.shapes.light_square);

            this.images.button_reveal.hide();
            this.labels.reveal_start.hide();

            this.images.button_next.on('click', () => {
                this.layer.destroyChildren();
                this.renderScreen();
            });
            this.layer.add(this.images.button_next);
            this.layer.add(this.labels.first_round);
            
            this.layer.draw();
        });

        this.layer.add(this.images.startscreen);
        this.layer.add(this.images.button_reveal);
        this.layer.add(this.labels.reveal_start);
        this.stage.add(this.layer);
    }

    renderScreen() {
        this.layer.add(this.images.background);
        this.layer.draw();
    }

    imagesLoaded(images) {
        this.images['startscreen'] = new Konva.Image({
            image: images.startscreen,
        });
        this.images['background'] = new Konva.Image({
            image: images.background,
        });
        this.images['init_shuttle'] = new Konva.Image({
            image: images.init_shuttle,
            x: 97,
            y: 620,
        });
        this.images['shuttle'] = new Konva.Image({
            image: images.shuttle,
            x: this.stage.width() / 2 - images.shuttle.width / 2,
            y: 580,
        });
        this.images['button_reveal'] = new Konva.Image({
            image: images.button_reveal,
            x: this.stage.width() / 2 - images.button_reveal.width / 2,
            y: 623,
        });
        this.images['button_next'] = new Konva.Image({
            image: images.button_next,
            x: this.stage.width() / 2 - images.button_next.width / 2 + 10,
            y: 635,
        });

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
        this.labels['status_label'] = new Konva.Text({
            x: 0,
            y: 94,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 16,
            text: '',
            fill: 'white'
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
        this.labels['reveal_start'] = new Konva.Text({
            x: 0,
            y: 647,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            text: 'REVEAL START POSITION',
            fill: '#24C5A3'
        });
        this.labels['init_shuttle_label'] = new Konva.Text({
            x: 0,
            y: 647,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            text: 'INITIATE SHUTTLE PHASE',
            fill: '#24C5A3'
        });
        this.labels['first_round'] = new Konva.Text({
            x: 0,
            y: 650,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            text: 'FIRST ROUND',
            fill: '#0E4B47'
        });
        this.labels['next_round'] = new Konva.Text({
            x: 0,
            y: 647,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 14,
            text: 'NEXT ROUND',
            fill: '#0E4B47'
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

