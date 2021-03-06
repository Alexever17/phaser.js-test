var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'one',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var score = 0;
var scoreText;
var endText;
var leftInterval;
var rightInterval

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude2.png', { frameWidth: 32, frameHeight: 46 });
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(70, 270, 'ground');
    platforms.create(750, 240, 'ground');
    platforms.create(400, 120, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    })

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    function collectStar(player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var xCoordinate = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(xCoordinate, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
            bomb.allowGravity = false;

        }
    }

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '28px', fill: '#fff' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        document.getElementById('title').innerHTML = `Game Over`;
        document.getElementById('undertitle').innerHTML = `Your score is ${score}`;
        document.getElementById('refresh').innerHTML = '<input type="button" class="uk-button-danger" value="New Game" onClick="window.location.reload()">';

        endText = this.add.text(285, 280, 'GAME OVER', { fontSize: '48px', fill: '#B9001D' });

        gameOver = true;
    }
}

function update() { 
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        upClick();
    }
}

function Interval(direction) {
    if (direction === 1) {
        leftInterval = setInterval(function(direction) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
     }, 10);
    } else {
        rightInterval = setInterval(function(direction) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }, 10);
    }
}

function upClick() {
    if (player.body.touching.down) {
        player.setVelocityY(-600);
    }
}

function myStopFunction(direction) {
    if (direction === 1) {
        clearInterval(leftInterval);
    } else {
        clearInterval(rightInterval);
    }
}