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
} from "./sketch.js";

let data = {
  roomId: 0,
  H: 400,
  W: 700,
  UD_d: 0,
  bar_d: 50,
  p1: {
    mouse_y: 0,
    score: 0,
  },
  p2: {
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
    socket.on("LR", (_champ) => {
      champ = _champ;
      console.log(`im ${champ}`);
    });
    router.events.on("routeChangeStart", () => {
      socket.emit(`gameOut`, roomId);
    });
    console.log(`game[${roomId}]`);
    socket.on(`game[${roomId}]`, (_data) => {
      data = { ..._data };
      console.log(data);
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

    if (champ == 1) {
      console.log(`im ${champ}`);
      // data.p1.mouse_y = p5.mouseY;
      let send = {
        roomId: roomId,
        m_y: p5.mouseY,
      };
      socket.emit("p1", send);
    } else if (champ == 2) {
      console.log(`im ${champ}`);
      // data.p2.mouse_y = p5.mouseY;
      let send = {
        roomId: roomId,
        m_y: p5.mouseY,
      };
      socket.emit("p2", send);
    }

    if (data.ball.x != 0) draw_ball(p5, data);
  };
  return <Sketch setup={setup} draw={draw} />;
}

// function p5_print() {
//   const setup = (p5: p5Types, canvasParentRef: Element) => {
//     // use parent to render the canvas in this ref
//     // (without that p5 will render the canvas outside of your component)
//     p5.createCanvas(data.game.W, data.game.H).parent(canvasParentRef);
//   };

//   let champ: number;
//   const draw = (p5: p5Types) => {
//     useEffect(() => {
//       socket.emit('im_gamer');
//       socket.on("LR", (_champ) => {
//         champ = _champ;
//         console.log(`im ${champ}`)
//       })
//       socket.on("game_data", (_data) => {
//         data = _data;
//       })
//       let bar_loop = setInterval(() => {
//         if (champ % 2 === 0) {
//           socket.emit("p1", data.p1.mouse_y);
//         }
//         else if (champ % 2 === 1) {
//           socket.emit("p2", data.p2.mouse_y);
//         }
//       }, 1000 / 30);
//     }, []);
//     if (Router.)
//     p5.background(230);
//     frame(p5, data);

//     draw_score(p5, data);

//     p5.fill('white');
//     twinkle(p5);
//     draw_p1_bar(p5, data);
//     draw_p2_bar(p5, data);

//     if (data.ball.x != 0)
//       draw_ball(p5, data);

//     data.p1.mouse_y = p5.mouseY;
//   };
//   return <Sketch setup={setup} draw={draw} />;
// }
