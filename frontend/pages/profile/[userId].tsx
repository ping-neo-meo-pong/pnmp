import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
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
  const userId = `${router.query.userId}`;

  return (
    <Layout>
      <Profile userId={userId} />
    </Layout>
  );
}
