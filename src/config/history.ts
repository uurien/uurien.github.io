// The small "bit of history" timeline shown next to About me.
// `icon` points at a file in public/history/ — drop in a real SVG/PNG logo
// and update the path to replace a placeholder. Order is the display order.
export type HistoryStop = {
  name: string;
  description: string;
  icon: string;
};

export const history: HistoryStop[] = [
  {
    name: 'University',
    description: 'Computer Systems Engineering.',
    icon: '/history/university.svg',
  },
  {
    name: 'Eurohelp',
    description: 'First job. Met my future co-founders here.',
    icon: '/history/eurohelp.svg',
  },
  {
    name: 'Arima',
    description: 'Started with a few colleagues from Eurohelp.',
    icon: '/history/arima.png',
  },
  {
    name: 'Hdiv',
    description: 'An IAST product born inside Arima.',
    icon: '/history/hdiv.png',
  },
  {
    name: 'Datadog',
    description: 'Hdiv became part of Datadog.',
    icon: '/history/datadog.png',
  },
];
