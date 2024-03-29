import { socket, useSocketAuthorization } from "../../lib/socket";
import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
} from "../../lib/sketch";
import { getLoginUser } from "../../lib/login";
import Layout from "../../components/Layout";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

let data = {
  leftUser: {},
  rightUser: {},
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

let bar_loop: NodeJS.Timer;

export default function GameRoom() {
  useSocketAuthorization();
  const router = useRouter();
  const userId = getLoginUser().id;

  const [leftUserName, setLeftUserName] = useState();
  const [rightUserName, setRightUserName] = useState();

  useEffect(() => {
    if (!router.isReady) return;
    const roomId = router.query.room_id;
    function routeChangeHandler() {
      socket.emit(`roomOut`, roomId);
    }
    router.events.on("routeChangeStart", routeChangeHandler);
    socket.on(`countDown`, (count: number) => {
      console.log(count);
      data.countDown = count;
    });
    socket.on(`countDown1`, (count: number) => {
      console.log(`countDown1: ${count}`);
      data.p1.countDown = count;
      data.countDown = -1;
    });
    socket.on(`countDown2`, (count: number) => {
      console.log(`countDown2: ${count}`);
      data.countDown = -1;
      data.p2.countDown = count;
    });
    socket.on(`game[${roomId}]`, (_data) => {
      data.p1.countDown = -1;
      data.p2.countDown = -1;
      data = {
        ..._data.gameData,
        leftUser: _data.leftUser,
        rightUser: _data.rightUser,
      };
    });

    socket.emit("giveMeGameUser", roomId);
    socket.on("gameUser", (data)=>{
      setLeftUserName(data.leftUserName);
      setRightUserName(data.rightUserName);
    })

    socket.on("getOut!", async () => {
      dataInit();
      await router.push(`/clients`);
    });

    console.log("before emit comeInGameRoom");
    socket.emit("comeInGameRoom", roomId);

    return () => {
      console.log(`hi? return`);
      router.events.off("routeChangeStart", routeChangeHandler);
      //socket.off("comeInGameRoom");
      socket.off("countDown");
      socket.off(`countDown1`);
      socket.off(`countDown2`);
      //socket.off(`game[${roomId}]`);
    };
  }, [router.isReady]);

  if (!router.isReady) return;
  const roomId = router.query.room_id;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(data.W, data.H).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(230);
    frame(p5, data);

    draw_score(p5, data);

    p5.fill("white");
    twinkle(p5);
    if (data.countDown >= 0) {
      draw_countDown(p5, data);
    } else {
      draw_countDown2(p5, data);
    }
    p5.fill("white");
    draw_p1_bar(p5, data);
    draw_p2_bar(p5, data);

    if (data.leftUser.id === userId || data.rightUser.id === userId) {
      let send = {
        roomId: roomId,
        m_y: p5.mouseY,
      };
      socket.emit("racket", send);
    }

    if (data.ball.x != 0) draw_ball(p5, data);
  };
  return (
    <Layout>
      <h2>{leftUserName} VS {rightUserName}</h2>
      <Sketch setup={setup} draw={draw} />
    </Layout>
  );
}

function dataInit() {
  data = {
    leftUser: {},
    rightUser: {},
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
}
