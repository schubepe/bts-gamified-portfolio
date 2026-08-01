// Tech stack assets module

import AdobeFirefly from './Adobe-Firefly.svg';
import AdobeLightroom from './Adobe-Lightroom.svg';
import Bambu from './Bambu.svg';
import Blender from './Blender.svg';
import CS from './CS.svg';
import CSS from './CSS.svg';
import DavinciResolve from './Davinci-Resolve.svg';
import Electron from './Electron.svg';
import Figma from './Figma.svg';
import FlutterLight from './Flutter-Light.svg';
import GithubLight from './Github-Light.svg';
import GraphQLLight from './GraphQL-Light.svg';
import HTML from './HTML.svg';
import JavaScript from './JavaScript.svg';
import Kubernetes from './Kubernetes.svg';
import NodeJSLight from './NodeJS-Light.svg';
import NotionLight from './Notion-Light.svg';
import NpmLight from './Npm-Light.svg';
import Postman from './Postman.svg';
import ReactLight from './React-Light.svg';
import StackOverflowLight from './StackOverflow-Light.svg';
import TailwindCSSLight from './TailwindCSS-Light.svg';
import TensorFlowLight from './TensorFlow-Light.svg';
import ThreeJSLight from './ThreeJS-Light.svg';
import TypeScript from './TypeScript.svg';
import UnityLight from './Unity-Light.svg';
import ViteLight from './Vite-Light.svg';
import VSCode from './VSCode.svg';


export const techStackIcons = {
  AdobeFirefly,
  AdobeLightroom,
  Bambu,
  Blender,
  CS,
  CSS,
  DavinciResolve,
  Electron,
  Figma,
  FlutterLight,
  GithubLight,
  GraphQLLight,
  HTML,
  JavaScript,
  Kubernetes,
  NodeJSLight,
  NotionLight,
  NpmLight,
  Postman,
  ReactLight,
  StackOverflowLight,
  TailwindCSSLight,
  TensorFlowLight,
  ThreeJSLight,
  TypeScript,
  UnityLight,
  ViteLight,
  VSCode,
};

export const techStackArray = Object.entries(techStackIcons).map(
  ([name, icon]) => ({
    name,
    icon,
  }),
);

/*
 * Curated icons for the orbit animation.
 * Change the order here to change their orbiting order.
 */
export const orbitingTechStack = [
  { name: 'Blender', icon: Blender },
  { name: 'Bambu Studio', icon: Bambu },
  { name: 'Figma', icon: Figma },
  { name: 'VS Code', icon: VSCode },
  { name: 'React', icon: ReactLight },
  { name: 'TypeScript', icon: TypeScript },
  { name: 'GitHub', icon: GithubLight },
  { name: 'Adobe Firefly', icon: AdobeFirefly },
  { name: 'Adobe Lightroom', icon: AdobeLightroom },
  { name: 'DaVinci Resolve', icon: DavinciResolve },
  { name: 'Notion', icon: NotionLight },
  { name: 'Three.js', icon: ThreeJSLight },
];

export default techStackIcons;
