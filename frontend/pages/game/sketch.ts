import p5Types from "p5";

export function frame(p5obj: p5Types, data: any) {
  p5obj.rect(0, 0, 20, data.H); // | <-
  p5obj.rect(data.W - 20, 0, 20, data.H); // -> |
  p5obj.rect(0, 0, data.W, 20);
  p5obj.rect(0, data.H - 20, data.W, 20);
}

export function twinkle(p5obj: p5Types) {
  if (p5obj.mouseIsPressed) {
    p5obj.fill(0);
  } else {
    p5obj.fill(255);
  }
}

export function draw_score(p5obj: p5Types, data: any) {
  p5obj.fill("blue");
  p5obj.textSize(50);
  p5obj.textAlign(p5obj.CENTER);
  p5obj.text("VS", data.W / 2, 60);

  p5obj.fill("black");
  p5obj.textSize(50);
  p5obj.textAlign(p5obj.LEFT);
  p5obj.text(data.p1.score, data.W / 3 - 30, 60);
  p5obj.textAlign(p5obj.LEFT);
  p5obj.text(data.p2.score, (2 * data.W) / 3, 60);

  if (data.p1.score == 5 || data.p2.score == -1) {
    p5obj.fill("green");
    p5obj.textSize(80);
    p5obj.textAlign(p5obj.CENTER);
    p5obj.text("!LEFT WIN!", data.W / 2, data.H / 2);
  }
  if (data.p2.score == 5 || data.p1.score == -1) {
    p5obj.fill("green");
    p5obj.textSize(80);
    p5obj.textAlign(p5obj.CENTER);
    p5obj.text("!RIGHT WIN!", data.W / 2, data.H / 2);
  }
}

export function draw_countDown(p5obj: p5Types, data: any) {
  p5obj.fill("blue");
  p5obj.textSize(100);
  p5obj.textAlign(p5obj.CENTER);
  p5obj.text(data.countDown, data.W / 2, data.H / 2);
}
export function draw_countDown2(p5obj: p5Types, data: any) {
  p5obj.fill("red");
  p5obj.textSize(100);
  p5obj.textAlign(p5obj.CENTER);

  if (data.p1.countDown > 0)
    p5obj.text(data.p1.countDown, data.W / 3, data.H / 2);
  if (data.p2.countDown > 0)
    p5obj.text(data.p2.countDown, (data.W * 2) / 3, data.H / 2);
}

export function draw_p1_bar(p5obj: p5Types, data: any) {
  // erase();
  // rect(data.bar_d, data.p1.mouse_y - 1000, 20, 2000);
  // // rect(W - data.bar_d - 21, data.p1.mouse_y - 1000, 21, 2000);
  // noErase();

  // let c = color("yellow");
  // fill(c);
  p5obj.rect(data.bar_d, data.p1.mouse_y - 40, 20, 80);
}

export function draw_p2_bar(p5obj: p5Types, data: any) {
  p5obj.rect(data.W - data.bar_d - 20, data.p2.mouse_y - 40, 20, 80);
}

export function draw_ball(p5obj: p5Types, data: any) {
  p5obj.rect(data.ball.x, data.ball.y, 20, 20);
}
