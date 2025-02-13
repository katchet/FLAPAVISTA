let bird;
      let gameOverFlag = false;
      let pipes =[];
      let pipeSpacing = 150;
      let nextPipe = 0;
      let pipeSpeed = 2.3;
      let speedIncreaseRate = 0.0001;
      let score = 0;
      let highScore = 0;
      let restartButton;

      function setup() {
        createCanvas(windowWidth, windowHeight);
        bird = new Bird();
        restartButton = createButton('PLAY');
        restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 50);
        restartButton.mousePressed(restartGame);
        restartButton.hide();

        gameOverFlag = true;
      }

      function draw() {
        background(248, 248, 248);
        bird.update();
        bird.display();

        if (frameCount > nextPipe) {
          pipes.push(new Pipe());
          nextPipe = frameCount + pipeSpacing;
        }

        pipeSpeed += speedIncreaseRate;

        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].update();
          pipes[i].display();

          if (!gameOverFlag && pipes[i].x + pipes[i].width < bird.x &&!pipes[i].scored) {
            score++;
            pipes[i].scored = true;
          }

          if (bird.intersects(pipes[i])) {
            gameOver();
          }

          if (pipes[i].x < -pipes[i].width) {
            pipes.splice(i, 1);
          }
        }

        if (bird.y - bird.size / 2 <= 0 || bird.y + bird.size / 2 >= height) {
          gameOver();
        }

        // Responsive text size
        textSize(width * 0.05);
        fill(255, 255, 255);
        text("Score: " + score, width / 2, height * 0.1);
        text("High Score: " + highScore, width / 2, height * 0.15);

        if (gameOverFlag) {
          textSize(width * 0.11);
          textAlign(CENTER,CENTER);
          fill(255, 255, 255);
          text("FLAPAVISTA", width / 2, height / 2);
          restartButton.show();
        } else {
          restartButton.hide();
        }
      }

      function touchStarted() {
        if (!gameOverFlag) {
          bird.flap();
        }
      }

      function restartGame() {
        gameOverFlag = false;
        bird = new Bird();
        pipes =[];
        nextPipe = 0;
        pipeSpeed = 2.3;
        score = 0;
        restartButton.hide();
      }

      function gameOver() {
        gameOverFlag = true;

        if (score > highScore) {
          highScore = score;
        }
      }

      function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
      }

      class Bird {
        constructor() {
          this.x = width * 0.25; // Responsive x position
          this.y = height / 2;
          this.gravity = 0.4;
          this.velocity = 0;
          this.lift = -13;
          this.size = width * 0.07; // Responsive size
        }

        update() {
          this.velocity += this.gravity;
          this.y += this.velocity;

          if (this.y + this.size / 2 > height) {
            this.y = height - this.size / 2;
            this.velocity = 0;
          }

          if (this.y - this.size / 2 < 0) {
            this.y = this.size / 2;
            this.velocity = 0;
          }
        }

        flap() {
          this.velocity += this.lift;
        }

        display() {
          noStroke();
          fill(253, 253, 253);
          square(this.x, this.y, this.size);
        }

        intersects(pipe) {
          let birdCenterX = this.x + this.size / 2;
          let birdCenterY = this.y + this.size / 2;
          let pipeCenterX = pipe.x + pipe.width / 2;
          let pipeCenterY = pipe.y + pipe.height / 2;
          let distX = Math.abs(birdCenterX - pipeCenterX);
          let distY = Math.abs(birdCenterY - pipeCenterY);
          if (distX > (pipe.width / 2 + this.size / 2) || distY > (pipe.height / 2 + this.size / 2)) {
            return false;
          }
          return true;
        }
      }

      class Pipe {
        constructor() {
          this.x = width;
          this.topBuffer = height * 0.1; // Responsive top buffer
          this.bottomBuffer = height * 0.1; // Responsive bottom buffer
          this.width = width * 0.0625; // Responsive width
          this.height = random(100, height - this.topBuffer - this.bottomBuffer - 100);
          let pipeCenter = this.height / 2;
          let availableSpace = height - this.topBuffer - this.bottomBuffer;
          let centerY = random(this.topBuffer + pipeCenter, height - this.bottomBuffer - pipeCenter);
          this.y = centerY - pipeCenter;
        }

        update() {
          this.x -= pipeSpeed;
        }

        display() {
          noStroke();
          fill(251, 251, 251);
          rect(this.x, this.y, this.width, this.height);
        }
      }
