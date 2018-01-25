import React from 'react';
import { Route } from "react-router-dom";
import VideoUpload from "../components/Video/VideoUpload";
import VideoRelease from "../components/Video/VideoRelease";
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
  component: VideoRelease,
  exact: true,
  authority: true,
}, {
  path: '/video/purchased',
  component: VideoPurchased,
  exact: true,
  authority: true,
}];

export const getRouterData = () => routerData;