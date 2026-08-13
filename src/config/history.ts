// The small "bit of history" timeline shown next to About me.
// `icon` points at a file in public/history/ — drop in a real SVG/PNG logo
// and update the path to replace a placeholder. Order is the display order.
export type HistoryStop = {
  name: string;
  icon: string;
};

export const history: HistoryStop[] = [
  { name: 'University', icon: '/history/university.svg' },
  { name: 'Eurohelp', icon: '/history/eurohelp.svg' },
  { name: 'Arima', icon: '/history/arima.png' },
  { name: 'Hdiv', icon: '/history/hdiv.png' },
  { name: 'Datadog', icon: '/history/datadog.png' },
  { name: 'Arima', icon: '/history/arima.png' },
];
