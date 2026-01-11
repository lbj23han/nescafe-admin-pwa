"use client";

import type {
  LayoutProps,
  HeaderProps,
  CardProps,
  RowProps,
  ButtonProps,
} from "./MyPage.types";

import { Layout, Header, Card, Row, Divider, Spacer } from "./ui/MyPageUI.base";
import {
  DangerButton,
  PrimaryButton,
  GhostButton,
  Input,
  ErrorText,
  HintText,
} from "./ui/MyPageUI.controls";

import {
  SectionTitle,
  InlineRow,
  ValueText,
  InputWrap,
  Collapse,
  CollapseToggleArea,
  SectionCard,
  BulletList,
  ThinDivider,
  InlineStack,
} from "./ui/MyPageUI.helpers";

import { AccountPanel } from "./ui/MyPageAccountPanel";
import { ProfilePanel } from "./ui/MyPageProfilePanel";

export const MyPageUI = {
  Layout,
  Header,
  Card,
  Row,
  Divider,
  Spacer,

  SectionTitle,
  InlineRow,
  ValueText,
  InputWrap,

  Collapse,
  CollapseToggleArea,

  DangerButton,
  PrimaryButton,
  GhostButton,

  Input,
  ErrorText,
  HintText,

  SectionCard,
  BulletList,

  ThinDivider,
  InlineStack,

  AccountPanel,
  ProfilePanel,
};

export type { LayoutProps, HeaderProps, CardProps, RowProps, ButtonProps };
