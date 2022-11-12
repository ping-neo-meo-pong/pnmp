// import { Socket } from "socket.io-client";
import { socket } from "./clients";

export default function Client() {
  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let message = event.currentTarget.message.value;
    socket.emit("hello", message);
  }
  return (
    <div>
      <h1>dm</h1>
      <form id="username" onSubmit={onSubmitMessage}>
        <input type="text" id="message" name="message" />
        <button type="submit">send</button>
      </form>
    </div>
  );
}
