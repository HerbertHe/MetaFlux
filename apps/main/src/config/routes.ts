interface IRoute {
  name?: string;
  redirect?: string;
  path: string;
  component?: string;
  layout?: boolean;
}

export const routes: IRoute[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "Home",
    path: "/home",
    component: "./home",
    layout: false,
  },
];
