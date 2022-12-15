import { useRouter } from "next/router";
import { user_data } from "./login";
import { socket, useSocketAuthorization } from "../lib/socket";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function matching() {
  useSocketAuthorization();
  const router = useRouter();
  useEffect(() => {
    function routeChangeHandler() {
      socket.emit(`cencelMatching`);
    }
    router.events.on("routeChangeStart", routeChangeHandler);
    socket.on("goToGameRoom", (roomId) => {
      user_data.is_player = 1;
      router.push(`/game/${roomId}`);
    });

    return () => {
      router.events.off("routeChangeStart", routeChangeHandler);
    };
  }, []);
  return (
    <Layout>
      <h1>Matching...</h1>
      <button
        onClick={() => {
          router.push(`/clients`);
          socket.emit(`cencelMatching`);
        }}
      >
        {" "}
        Cancel Matching{" "}
      </button>
    </Layout>
  );
}
