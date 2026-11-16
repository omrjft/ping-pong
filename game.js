const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleImage = new Image();
paddleImage.src = "images/catShield.png";

const ballImage = new Image();
ballImage.src = "images/catball.png";

const playerName = prompt("¿Cómo te llamas?")?.trim() || "Jugador";

// Estado del juego
const paddle = {
    x: 30,
    y: 175,
    width: 150,
    height: 250,
    speed: 10,
    dy: 0
};

const ball = {
    x: 400,
    y: 225,
    radius: 60,
    speedX: 50,
    speedY: 5
};

let score = 0;
// Captura de eventos del teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "e" || e.key === "E") {
        paddle.dy = -paddle.speed;
    } else if (e.key === "ArrowDown" || e.key === "d" || e.key === "D") {
        paddle.dy = paddle.speed;
    }
});
document.addEventListener("keyup", (e) => {
    if (
        e.key === "ArrowUp" || e.key === "ArrowDown" ||
        e.key === "e" || e.key === "E" || e.key === "d" || e.key === "D "
    ) {
        paddle.dy = 0;
    }
});
// Lógica de físicas y colisiones
function update() {
    // 1. Movimiento de la paleta
    paddle.y += paddle.dy;

    // Limitar la paleta para que no salga del Canvas
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;

    // 2. Movimiento de la pelota
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebote superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
    }

    // Rebote en la pared derecha (simulando el modo práctica)
    if (ball.x + ball.radius > canvas.width) {
        ball.speedX *= -1;
    }
    // 3. Colisión de la pelota con la paleta
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
    ) {ball.speedX *= -1;
        // Aumentar ligeramente la velocidad para dar progresión al juego
        ball.speedX += (ball.speedX > 0) ? 1.3 : -1.3;
        ball.x = paddle.x + paddle.width + ball.radius; // Evitar que la pelota se "atasque"
        score=score+5;
    }
    // 4. Reinicio si la pelota sale por la izquierda
    if (ball.x < 0) {
        resetGame();
    }
}

// Función para reiniciar el estado
function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
    score = 0;
}

// Dibujo de los elementos en el Canvas
function draw() {
    // Limpiar el fotograma anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar pared derecha (visual)
    ctx.fillStyle = "#555";
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

    // Dibujar paleta
    if (paddleImage.complete && paddleImage.naturalWidth > 0) {
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // Dibujar pelota
    if (ballImage.complete && ballImage.naturalWidth > 0) {
    const size = ball.radius * 2;
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, size, size);
}
    // Dibujar marcador
    ctx.font = "30px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`${playerName}: ${score}`, canvas.width / 2 - 60, 40);
}

// Bucle de animación principal
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();