import { useRouter } from "next/router"
import { socket } from "./login";
import { useEffect } from "react";

export default function matching() {
  const router = useRouter();
  useEffect(()=>{
    socket.on('goToGameRoom', (roomId)=>{
      router.push(`/game/${roomId}`);
    });
  }, []);
  return (
    <div>
      <h1>
        Matching...
      </h1>
        <button onClick={()=>{
          router.push(`/clients`);
          socket.emit(`cencelMatching`);
        }}> Cencel Matching </button>
    </div>
  )
}