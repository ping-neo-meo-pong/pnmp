import { useEffect, useState } from "react";
import Image from "next/image";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import Sheet from "@mui/joy/Sheet";
import Link from "@mui/joy/Link";
import FormControl from "@mui/joy/FormControl";
import Button from "@mui/joy/Button";
import Avatar from "@mui/joy/Avatar";
import { CssVarsProvider } from "@mui/joy/styles";
import axios from "axios";
import { Box } from "@mui/system";
import { Dialog, DialogTitle, List, Switch } from "@mui/material";
import { socket } from "../lib/socket";
import { useRouter } from "next/router";

// function Copyright(props: any) {
//     return (
//       <Typography
//         variant="body2"
//         color="text.secondary"
//         align="center"
//         {...props}
//       >
//         {"Copyright © "}
//         <Link href="https://localhost">ping-neo-meo-pong</Link>{" "}
//         {new Date().getFullYear()}
//         {"."}
//       </Typography>
//     );
//   }

// export default function TwoFactorAuthentificator() {
//   const [code, setCode] = useState("");

//   const handleSubmit = async () => {
//     // const body = new FormData();
//     // body.append("file", image);
//     // axios
//     //   .post(`/server/api/2fa?${code}`, {
//     //     method: "POST",
//     //     body,
//     //   })
//     //   .then((res) => {})
//   };

//     return (
//         <CssVarsProvider>
//           <FormControl>
//             <Sheet
//             variant="outlined"
//             sx={{
//                 width: 300,
//                 mx: "auto", // margin left & right
//                 my: 4, // margin top & botom
//                 py: 3, // padding top & bottom
//                 px: 2, // padding left & right
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 2,
//                 borderRadius: "sm",
//                 boxShadow: "md",
//                 alignItems: "center",
//             }}
//         >
//           <Image src="/pu.svg" alt="home" width={220} height={180} />
//           <Typography level="h4"> One Time Password</Typography>
//           <TextField
//             value={code}
//             placeholder="Code"
//             required
//             sx={{ width: 300 }}
//             onChange={(e) => setCode(e.target.value)}
//           />
//           <Button
//             onClick={() => {
//               handleSubmit();
//             }}
//             sx={{ width: 300 }}
//           >
//             Send
//           </Button>
//         </Sheet>
//         </FormControl>
//         <Copyright sx={{ mt: 2, mb: 4 }} />
//       </CssVarsProvider>
//     );
// }

export default function TwoFactorAuthentificator() {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const [QRCode, setQRCode] = useState("");

  useEffect(() => {
    axios.get(`/server/api/auth/2fa-qrcode`).then((res) => {
      /////////////////   set qrcode   ///////////////
      setQRCode(res.data);
    });
  }, []);
  return (
    <Box>
      <CssVarsProvider>
        <Sheet
          variant="outlined"
          sx={{
            width: 300,
            mx: "auto", // margin left & right
            my: 4, // margin top & botom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            alignItems: "center",
          }}
        >
          <Image src={QRCode} alt="home" width={250} height={250} />
          <Typography level="h4"> One Time Password</Typography>
          <TextField
            value={inputCode}
            placeholder="Code"
            required
            sx={{ width: 300 }}
            onChange={(e) => setInputCode(e.target.value)}
          />
          {/* //////////////// QRCODE //////////////// */}

          <Button
            variant="outlined"
            onClick={() => {
              //////////////////////   2FA Code   //////////////////////
              axios
                .patch(`/server/api/user`, {
                  twoFactorAuth: true,
                  otp: inputCode,
                })
                .then((res) => {
                  console.log(res.data);
                  socket.emit("authorize", res.data.accessToken);
                  const loginUser = {
                    id: res.data.id,
                    username: res.data.username,
                    jwt: res.data.accessToken,
                  };
                  window.localStorage.setItem(
                    "loginUser",
                    JSON.stringify(loginUser)
                  );
                  router.push("/clients");
                })
                .catch((e) => {
                  console.error(e);
                });
            }}
          >
            인증하기
          </Button>
        </Sheet>
      </CssVarsProvider>
    </Box>
  );
}
