export type Link = {
  slug: string;
};

export type MyLink = {
  uid: string;
  createdByEmail: string;
  createdByUid?: string;
  createdAt: number;
};

export type MyLinks = {
  count: number;
  items: MyLink[];
};
