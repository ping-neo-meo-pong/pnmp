import { socket } from "../login";
import { user_data } from "../login";
import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import {
  frame,
  draw_score,
  twinkle,
  draw_p1_bar,
  draw_p2_bar,
  draw_ball,
  draw_countDown,
  draw_countDown2,
} from "./sketch.js";

let data = {
  is_player: -1,
  roomId: 0,
  H: 400,
  W: 700,
  UD_d: 0,
  bar_d: 50,
  countDown: -1,
  p1: {
    countDown: -1,
    mouse_y: 0,
    score: 0,
  },
  p2: {
    countDown: -1,
    mouse_y: 0,
    score: 0,
  },
  ball: {
    x: 0,
    y: 0,
    v_x: 0,
    v_y: 0,
  },
};

let gameRoomId;
let bar_loop: NodeJS.Timer;

export default function GameRoom() {
  const router = useRouter();
  const roomId = router.query.room_id;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(data.W, data.H).parent(canvasParentRef);
  };
  useEffect(() => {
    socket.emit("comeInGameRoom", roomId);
    router.events.on("routeChangeStart", () => {
      socket.emit(`gameOut`, roomId);
    });
    socket.on(`countDown`, (count: number) => {
      console.log(count);
      data.countDown = count;
    });
    socket.on(`countDown1`, (count: number) => {
      console.log(`countDown1: ${count}`);
      data.p1.countDown = count;
    });
    socket.on(`countDown2`, (count: number) => {
      console.log(`countDown2: ${count}`);
      data.p2.countDown = count;
    });
    // console.log(`game[${roomId}]`);
    socket.on(`game[${roomId}]`, (_data) => {
      data.p1.countDown = -1;
      data.p2.countDown = -1;
      data = { ..._data };
      // console.log(data);
      // data.ball.x = _data.ball.x;
      // data.ball.y = _data.ball.y;
    });
  }, []);

  let champ: number;
  const draw = (p5: p5Types) => {
    p5.background(230);
    frame(p5, data);

    draw_score(p5, data);

    p5.fill("white");
    twinkle(p5);
    draw_p1_bar(p5, data);
    draw_p2_bar(p5, data);
    if (data.countDown >= 0) {
      draw_countDown(p5, data);
    }
    // console.log(`data.p1.countdown: ${data.p1.countDown}`);
    // console.log(`data.p2.countdown: ${data.p2.countDown}`);
    if (data.p1.countDown >= 0 || data.p2.countDown >= 0) {
      draw_countDown2(p5, data);
    }

    let send = {
      roomId: roomId,
      m_y: p5.mouseY,
    };
    socket.emit("racket", send);

    if (data.ball.x != 0) draw_ball(p5, data);
  };
  return <Sketch setup={setup} draw={draw} />;
}
