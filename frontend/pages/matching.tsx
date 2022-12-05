import { useRouter } from "next/router"
import { socket, user_data } from "./login";
import { useEffect } from "react";

export default function matching() {
  const router = useRouter();
  useEffect(()=>{
    function routeChangeHandler() {
      socket.emit(`cencelMatching`);
    }
    router.events.on("routeChangeStart", routeChangeHandler);
    socket.on('goToGameRoom', (roomId)=>{
      user_data.is_player = 1;
      router.push(`/game/${roomId}`);
    });

    return ()=>{
      router.events.off("routeChangeStart", routeChangeHandler);
    }
  }, []);
  return (
    <div>
      <h1>
        Matching...
      </h1>
        <button onClick={()=>{
          router.push(`/clients`);
          socket.emit(`cencelMatching`);
        }}> Cancel Matching </button>
    </div>
  )
}