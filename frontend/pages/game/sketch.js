export function frame(p5obj, data) {
	p5obj.rect(0, 0, 20, data.game.H); // | <-
	p5obj.rect(data.game.W - 20, 0, 20, data.game.H); // -> |
	p5obj.rect(0, 0, data.game.W, 20);
	p5obj.rect(0, data.game.H - 20, data.game.W, 20);
}

export function twinkle(p5obj) {
	if (p5obj.mouseIsPressed) {
		p5obj.fill(0);
	} else {
		p5obj.fill(255);
	}
}

export function draw_score(p5obj, data) {
	p5obj.fill('blue');
	p5obj.textSize(50);
	p5obj.textAlign(p5obj.CENTER);
	p5obj.text('VS', data.game.W / 2, 60);

	p5obj.fill('black');
	p5obj.textSize(50);
	p5obj.textAlign(p5obj.LEFT);
	p5obj.text(data.p1.score, data.game.W / 3 - 30, 60);
	p5obj.textAlign(p5obj.LEFT);
	p5obj.text(data.p2.score, 2 * data.game.W / 3, 60);
}

export function draw_p1_bar(p5obj, data) {
	// erase();
	// rect(data.game.bar_d, data.p1.mouse_y - 1000, 20, 2000);
	// // rect(W - data.game.bar_d - 21, data.p1.mouse_y - 1000, 21, 2000);
	// noErase();

	// let c = color("yellow");
	// fill(c);
	p5obj.rect(data.game.bar_d, data.p1.mouse_y - 40, 20, 80);
}

export function draw_p2_bar(p5obj, data) {
	p5obj.rect(data.game.W - data.game.bar_d - 20, data.p2.mouse_y - 40, 20, 80);
}

export function draw_ball(p5obj, data) {
	p5obj.rect(data.ball.x, data.ball.y, 20, 20);
}
