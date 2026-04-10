interface IRoute {
  name?: string;
  redirect?: string;
  path: string;
  component?: string;
  layout?: boolean;
}

export const routes: IRoute[] = [
  {
    name: "Home",
    path: "/",
    component: "./home",
    layout: false,
  },
  {
    name: "Demo",
    path: "/demo",
    component: "./demo",
    layout: false,
  },
];
