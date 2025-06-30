import { createIcon } from "@chakra-ui/react";

export const EmptyIcon = createIcon({
  displayName: "EmptyIcon",
  defaultProps: {
    fill: "currentcolor"
  },
  path: [
    <path d="M0 0h24v24H0V0z" fill="none" />,
    <path d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" />
  ]
});

export const NotEmptyIcon = createIcon({
  displayName: "NotEmptyIcon",
  defaultProps: {
    fill: "currentcolor"
  },
  path: [
    <path d="M0 0h24v24H0V0z" fill="none" />,
    <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7zm12-4h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z" />
  ]
});

export const DeleteIcon = createIcon({
  displayName: "DeleteIcon",
  defaultProps: {
    fill: "currentcolor"
  },
  path: [
    <path d="M0 0h24v24H0V0z" fill="none" />,
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
  ]
});

export const BackIcon = createIcon({
  displayName: "BackIcon",
  defaultProps: {
    fill: "currentcolor"
  },
  path: [
    <path d="M0 0h24v24H0V0z" fill="none" />,
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  ]
});

export const ErrorIcon = createIcon({
  displayName: "ErrorIcon",
  defaultProps: {
    fill: "currentcolor"
  },
  path: [
    <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  ]
});
