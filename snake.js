class Snake {
    constructor() {
        this.body = [new Vector(2, 1)];
        this.bodyLength = 3;
        this.direction = DIRECTION.RIGHT;
        this.canChangeDirection = true;
        this.food = new Food();
        this.score = 0; // Tambahkan skor

        let maxCol = Math.floor(width / gridSize);
        let maxRow = Math.floor(height / gridSize);
        this.brain = new Dijkstra(maxCol, maxRow);
    }

    predict() {
        // Hanya AI mode yang memanggil predict
        if (typeof gameMode !== 'undefined' && gameMode === 'ai') {
            let next_direction = this.brain.predict([...this.body], this.food);
            for(let dir in DIRECTION) {
                if(next_direction && DIRECTION[dir].x == next_direction.x && DIRECTION[dir].y == next_direction.y) {
                    this.changeDirection(next_direction);
                    return;
                }
            }
        }
    }

    move() {
        let head = this.body[0];
        head = new Vector(head.x + this.direction.x, head.y + this.direction.y);
        this.body.unshift(head);
        let tail = this.body.pop();

        if(this.isHitWall() || this.isHitBody()) {
            showGameOver(this.score); // Ganti alert dengan showGameOver
            frameRate(0);
            return; // Stop move
        }

        if(this.isHitFood()) {
            this.bodyLength++;
            this.score++; // Tambah skor
            updateScore(this.score); // Update skor di UI
            this.food.generate();
            while(!this.isValidFood()) {
                this.food.generate();
            }
        }

        if(this.body.length < this.bodyLength) {
            this.body.push(tail);
        }

        this.canChangeDirection = true;
        this.predict(); // Akan otomatis skip jika mode manual
    }

    isValidFood() {
        for(let i = 0; i<this.body.length; i++) {
            if(this.food.x == this.body[i].x && this.food.y == this.body[i].y) {
                return false;
            }
        }
        return true;
    }

    isHitFood() {
        let head = this.body[0];
        return (head.x == this.food.x && head.y == this.food.y);
    }

    isHitWall() {
        let head = this.body[0];
        let maxCol = Math.floor(width / gridSize);
        let maxRow = Math.floor(height / gridSize);

        return (head.x < 0 || head.x >= maxCol || head.y < 0 || head.y >= maxRow);
    }

    isHitBody() {
        let head = this.body[0];
        for(let i = 1; i<this.body.length; i++) {
            if(head.x == this.body[i].x && head.y == this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    changeDirection(direction) {
        if(this.direction == DIRECTION.UP && direction == DIRECTION.DOWN
            || this.direction == DIRECTION.DOWN && direction == DIRECTION.UP
            || this.direction == DIRECTION.LEFT && direction == DIRECTION.RIGHT
            || this.direction == DIRECTION.RIGHT && direction == DIRECTION.LEFT
            || !this.canChangeDirection) {
                return;
            }
        this.canChangeDirection = false;
        this.direction = direction;
    }

    draw() {
        fill(255);
        this.body.forEach(box => drawBox(box.x, box.y));
        this.food.draw();
    }
}