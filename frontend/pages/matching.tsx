import { useRouter } from "next/router"
import { socket } from "./login";


export default function matching() {
  const router = useRouter();
  return (
    <div>
      <h1>
        <button onClick={()=>{
          router.push(`/clients`);
          socket.emit(`cencelMatching`);
        }}> Cencel Matching </button>
      </h1>
    </div>
  )
}