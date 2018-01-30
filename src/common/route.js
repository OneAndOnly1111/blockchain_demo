import React from 'react';
import { Route } from "react-router-dom";
import VideoUpload from "../components/Video/VideoUpload";
import VideoRelease from "../components/Video/VideoRelease";
import VideoPurchased from "../components/Video/VideoPurchased";
import VideoStorage from "../components/Video/VideoStorage";
import UserLogin from "../components/User/Login";
import UserRegister from "../components/User/Register";

const routerData = [{
  path: '/user/login',
  component: UserLogin,
  exact: true,
  authority: true,
}, {
  path: '/user/register',
  component: UserRegister,
  exact: true,
  authority: true,
}, {
  path: '/',
  component: VideoUpload,
  exact: true,
  authority: true,
}, {
  path: '/video/upload',
  component: VideoUpload,
  exact: true,
  authority: true,
}, {
  path: '/video/release',
  component: VideoRelease,
  exact: true,
  authority: true,
}, {
  path: '/video/purchased',
  component: VideoPurchased,
  exact: true,
  authority: true,
}, {
  path: '/video/storage',
  component: VideoStorage,
  exact: true,
  authority: true,
}];

export const getRouterData = () => routerData;