import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { user_data } from "../login";
import { socket, useSocketAuthorization } from "../../lib/socket";
import { logout, getLoginUser } from "../../lib/login";
import Layout from "../../components/Layout";
import { Button } from "@mui/material";
import {
  InviteModal,
  InviteModalWithUserName,
  MatchingModal,
} from "../../components/InviteModal";
import Profile from "../../components/Profile";

export default function ProfilePage() {
  useSocketAuthorization();
  const router = useRouter();
  const name = `${router.query.user_name}`;

  return (
    <Layout>
      <Profile userName={name} />
    </Layout>
  );
}
