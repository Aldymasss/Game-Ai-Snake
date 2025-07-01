class Food {
    constructor() {
        this.generate();
    }

    generate() {
        let maxCol = Math.floor(width / gridSize);
        let maxRow = Math.floor(height / gridSize);
        this.x = Math.floor(Math.random() * maxCol);
        this.y = Math.floor(Math.random() * maxRow);
    }

    draw() {
        // Ubah warna food menjadi merah
        fill(220, 40, 40);
        stroke(180, 20, 20);
        strokeWeight(2);
        ellipse(
            this.x * gridSize + gridSize / 2,
            this.y * gridSize + gridSize / 2,
            gridSize * 0.6,
            gridSize * 0.6
        );
    }
}