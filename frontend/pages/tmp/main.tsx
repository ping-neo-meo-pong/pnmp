export default function Main() {
  return <>
    <head>
      <title>PNMP</title>
    </head>
    <body>
      <button>Find Match</button>
      <ul>
        <Watching />
        <Stats />
        <Dropdown />
      </ul>
      <div>
        <ProfileImage />
      </div>
    </body>
  </>
}

function Watching() {
  return <li>Live</li>;
}

function Stats() {
  return <li>Stats</li>;
}

function ProfileImage() {
  return <li>Profile-Image</li>;
}

function Dropdown() {
  return <li>Dropdown</li>;
}

function Live() {
  return <li>Live</li>;
}

function Contents() {
  return <p>Primary Contents</p>;
}

function Chats() {
  return <section>Chat Panel</section>;
}
