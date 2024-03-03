
import { Math as PhaserMath, Types } from "phaser";
import { BaseScene, Difficulties } from "./_Base";

const GRAVITY = 600;
const FLAP_POWER = 225;
const GAME_SPEED = 200;

type ISprite = Types.Physics.Arcade.SpriteWithDynamicBody;

type MinMax<T = number> = { min: T; max: T; };
const DifficultyLookup: Record<Difficulties, {
  pipeGapRange: MinMax;
  pipeSpacingRange: MinMax;
}> = {
  'easy': {
    pipeGapRange: { min: 150, max: 200 },
    pipeSpacingRange: { min: 300, max: 350 }
  },
  'normal': {
    pipeGapRange: { min: 130, max: 180 },
    pipeSpacingRange: { min: 280, max: 330 }
  },
  'hard': {
    pipeGapRange: { min: 115, max: 145 },
    pipeSpacingRange: { min: 250, max: 310 }
  }
};

export class Gameplay extends BaseScene {

  bird: Types.Physics.Arcade.SpriteWithDynamicBody;
  pipes: Phaser.Physics.Arcade.Group;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  bestScoreText: Phaser.GameObjects.Text;
  
  isPaused: boolean;
  pauseButton: Phaser.GameObjects.Image;
  resumeEvent: Phaser.Events.EventEmitter;

  birdStartPosition: Types.Math.Vector2Like; 

  countDownTime: number;
  countDownText: Phaser.GameObjects.Text;
  countDownEvent: Phaser.Time.TimerEvent;

  pipeCheckElapsedTime: number;

  constructor() {
    super('Gameplay');
  }

  create() {
    super.create();
    
    this.birdStartPosition = { x: this.gameWidth * 0.1, y: this.gameHeight / 2 };

    this.initBird();
    this.initPipes();
    this.initColliders();

    this.initPause();
    this.initScore();

    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
    this.input.keyboard.on('keydown-ESC', this.pauseGame, this);
  }

  initPause() {
    this.pauseButton = this.add.image(this.gameWidth - 10, this.gameHeight - 10, 'pause')
      .setOrigin(1)
      .setScale(1.5)
      .setInteractive({ cursor: 'pointer'})
      .on('pointerdown', (p: Phaser.Input.Pointer) => {
        p.event.stopPropagation();
        this.pauseGame();
      }, this);

    if(this.resumeEvent) {
      return;
    }

    this.resumeEvent = this.events.on('resume', () => {
      this.startCountDown();
    }, this);
  }

  initBird() {
    this.bird = this.character
      .buildForFly(this, 'physics', this.birdStartPosition)
      .setOrigin(0);

    this.bird.body.gravity.y = GRAVITY;
    this.bird.setCollideWorldBounds(true, undefined, 0.2, true);
    this.physics.world.on('worldbounds', (b: Phaser.Physics.Arcade.Body, _up: boolean, down: boolean) => {
      if (b.gameObject === this.bird && down) {
        this.bird.setVelocityY(-(FLAP_POWER / 2));
      }
    }, this);
  }

  initPipes() {
    this.pipes = this.physics.add.group();
    for(let i = 0; i < 4; i++) {
      const upper = this.buildPipe();
      const lower = this.buildPipe();
      this.placePipe(upper, lower);
    }

    this.pipes.setVelocityX(-GAME_SPEED);
  }

  initScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { font: '700 32px Arial', color: '#000' });
    this.bestScoreText = this.add.text(16, 52, `Best score: ${this.bestScore}`, { font: '500 18px Arial', color: '#000' });
  }

  initColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, undefined, this);
  }

  update(_: number, delta: number) {
    const tooHigh = this.bird.y <= -this.bird.height;
    const tooLow =  this.bird.y >= this.gameHeight;

    if (tooHigh || tooLow) {
      this.gameOver();
    }

    this.tryRecyclePipes(delta);
  }

  startCountDown() {
    this.countDownTime = 3;
    this.countDownText = this.add
      .text(this.gameCenter.x, this.gameCenter.y, 'Fly in ' + this.countDownTime, { font: '700 32px Arial', color: '#FFF' })
      .setOrigin(0.5);
    this.countDownEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        --this.countDownTime;
        this.countDownText.setText('Fly in ' + this.countDownTime);
        if(this.countDownTime <= 0) {
          this.countDownText.setText('');
          this.countDownEvent.remove();
          this.countDownEvent = undefined;
          this.physics.resume();
          this.isPaused = false;
        }
      },
      callbackScope: this,
      repeat: this.countDownTime,
    });
  }

  flap() {
    if(this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -FLAP_POWER;
  }

  placePipe(upper: ISprite, lower: ISprite) {
    let x = this.getLastPipeX();
    const { pipeSpacingRange, pipeGapRange } = DifficultyLookup[this.resolveDifficulty()];

    if(x === 0) {
      x = 400
    } else {
      x += PhaserMath.Between(pipeSpacingRange.min, pipeSpacingRange.max);
    }

    const gap = PhaserMath.Between(pipeGapRange.min, pipeGapRange.max);
    const maxY = this.gameHeight - gap - 75;
    const minY = 75;

    upper.setX(x);
    upper.setY(PhaserMath.Between(minY, maxY));
    upper.setOrigin(0, 1);
    upper.setFlipY(true);

    lower.setX(x);
    lower.setY(upper.y + gap);
    lower.setOrigin(0, 0);
  }

  buildPipe(): ISprite {
    return (this.pipes.create(0, 0, 'pipe') as ISprite)
      .setImmovable(true)
      .setScale(0.22)
      .setOrigin(0, 0);
  }

  getLastPipeX() {
    let x = 0;
    this.pipes.getChildren().forEach((p: ISprite) => {
      x = Math.max(x, (p as any).x);
    }, this);

    return x;
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    })
  }

  tryRecyclePipes(delta: number) {
    this.pipeCheckElapsedTime += delta;
    if(this.pipeCheckElapsedTime < 10) {
      return;
    }

    this.pipeCheckElapsedTime = 0;
    const tempPipes: ISprite[] = [];
    this.pipes.getChildren().forEach((p: ISprite) => {
      if(p.getBounds().right < 0) {
        tempPipes.push(p);
      }
    });

    if(tempPipes.length === 2) {
      this.placePipe(tempPipes[0], tempPipes[1]);
      this.incrementScore();
    }
  }

  checkCollision() {
    const tooHigh = this.bird.y < -this.bird.height;
    const tooLow =  this.bird.y > this.gameHeight;

    if (tooHigh || tooLow) {
      this.gameOver();
    }
  }

  incrementScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    if(this.bestScore < this.score) {
      this.setBestScore(this.score);
      this.bestScoreText.setText(`Best score: ${this.bestScore}`);
    }

    if(this.score >= 1) {

    }
  }

  resolveDifficulty(): Difficulties {
    if(this.score > 3) {
      return 'hard';
    }

    if(this.score > 1) {
      return 'normal';
    }

    return 'easy'
  }

  pauseGame() {
    this.physics.pause();
    this.scene.pause();
    this.scene.launch('Pause');
  }
}
