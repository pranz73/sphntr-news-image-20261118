# Night Sky Dispatch — 18 November 2026

[![make.fun competition](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118)
[![Rank](https://make.fun/badge/news-image-20261118/pranz73/sphntr-news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118)
[![Reward](https://make.fun/badge/news-image-20261118/pranz73/sphntr-news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118)

This entry is a 1024 × 1024 night-sky front page for Wednesday, 18 November 2026. Its hero visual follows Voyager 1’s radio call along a dotted path through distance rings: the spacecraft is about 16 billion miles away, one light-day from Earth, and its signal takes 24 hours to arrive.

Six short dispatches widen the view to the US and Iran’s exchange of strikes and drone attacks affecting Bahrain and Kuwait (Reuters); Ukraine’s second-day strike on the Kerch Bridge (Reuters); Xi and Putin at the APEC summit in Shenzhen ahead of a Thursday meeting with Trump (Reuters); the United States losing measles-elimination status, with 5,412 cases and 10 deaths (AP); Congo’s Ebola outbreak passing 11,000 cases (PAHO); and Mary Peltola’s Alaska win giving Democrats a 56–44 Senate majority (AP). The image credits Reuters, NASA JPL, AP, and PAHO.

Run the deliverable program with Node 22:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies the committed `entry.png` beside it to the chosen output directory. To reproduce the image during build-time, run `node render.mjs`; it renders `index.html` with `/opt/meta-chromium/chrome`.
