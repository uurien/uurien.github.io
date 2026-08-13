export type Activity = {
  source: 'bluesky' | 'github';
  title?: string;
  text?: string;
  image?: string;
  url: string;
  date: Date;
};
