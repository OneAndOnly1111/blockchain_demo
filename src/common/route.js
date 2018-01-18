import React from 'react';
import { Route } from "react-router-dom";
// import Video from "../components/VideoCopyright";
import VideoNormalUser from "../components/VideoNormalUser";
// import PurchaseRecord from "../components/VideoNormalUser/purchaseRecord";
import VideoUpload from "../components/Video/VideoUpload";
import VideoPurchased from "../components/Video/VideoPurchased";

const routerData = [{
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
  component: null,
  exact: true,
  authority: true,
}, {
  path: '/video/analyse',
  component: VideoNormalUser,
  exact: true,
  authority: true,
}, {
  path: '/video/purchased',
  component: VideoPurchased,
  exact: true,
  authority: true,
}];

export const getRouterData = () => routerData;