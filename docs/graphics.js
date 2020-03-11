class Display {
    constructor() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: 380,
            height: 726
        });
        this.layer = new Konva.Layer();

        this.sources = {
            startscreen: '/assets/startscreen.png',
            background: '/assets/background.png',
            init_shuttle: '/assets/init_shuttle.png',
            shuttle: '/assets/shuttle.png',
            next_round: '/assets/next_round.png',
        };
        this.nodes = {};

        this.setupTexts();
        this.setupShapes();
        this.loadImages();
    }

    displayStartScreen() {
        /*
        this.nodes.status_label.text('NEW GAME - STARTING PLAYER ORDER');
        this.layer.add(this.nodes.background);
        this.layer.add(this.nodes.shuttle);
        this.layer.add(this.nodes.active_mission);
        this.layer.add(this.nodes.status_label);
        this.layer.add(this.nodes.next_round);

        this.layer.add(this.nodes.rect1);
        this.layer.add(this.nodes.rect2);
        this.layer.add(this.nodes.rect3);
        this.layer.add(this.nodes.rect4);
        this.layer.add(this.nodes.rect5);
        this.layer.add(this.nodes.rect6);
        */

        this.layer.add(this.nodes.startscreen);
        this.layer.add(this.nodes.init_shuttle);
        this.stage.add(this.layer);
    }

    imagesLoaded(images) {
        this.nodes['startscreen'] = new Konva.Image({
            image: images.startscreen,
        });
        this.nodes['background'] = new Konva.Image({
            image: images.background,
        });
        this.nodes['init_shuttle'] = new Konva.Image({
            image: images.init_shuttle,
            x: 97,
            y: 620,
        });
        this.nodes['shuttle'] = new Konva.Image({
            image: images.shuttle,
            x: this.stage.width() / 2 - images.shuttle.width / 2,
            y: 580,
        });
        this.nodes['next_round'] = new Konva.Image({
            image: images.next_round,
            x: this.stage.width() / 2 - images.next_round.width / 2,
            y: 635,
        });
        this.nodes.next_round.on('click', () => {
            this.nodes.shuttle.hide();
            this.layer.destroy();
        });

        this.displayStartScreen();
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

    setupTexts() {
        this.nodes['status_label'] = new Konva.Text({
            x: 0,
            y: 94,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 16,
            text: '',
            fill: 'white'
        });
        this.nodes['action'] = new Konva.Text({
            x: 0,
            y: this.stage.height() / 2 + 20,
            width: this.stage.width(),
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 62,
            text: '1',
            fill: 'white'
        });
        this.nodes['mission'] = new Konva.Text({
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

    setupShapes() {
        this.nodes['active_mission'] = new Konva.Circle({
            x: this.stage.width() / 2,
            y: 176,
            radius: 33,
            fill: '#cf4541',
        });
        this.nodes['inactive_mission'] = new Konva.Circle({
            x: this.stage.width() / 2,
            y: 176,
            radius: 33,
            fill: '#aaa9a2',
        });

        this.nodes['rect1'] = new Konva.Rect({ x: 17, y: 435, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.nodes['rect2'] = new Konva.Rect({ x: 17, y: 455, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.nodes['rect3'] = new Konva.Rect({ x: 17, y: 475, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.nodes['rect4'] = new Konva.Rect({ x: 17, y: 495, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.nodes['rect5'] = new Konva.Rect({ x: 17, y: 515, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
        this.nodes['rect6'] = new Konva.Rect({ x: 17, y: 535, width: 25, height: 15, cornerRadius: 2, fill: '#aaa9a2' });
    }
}

