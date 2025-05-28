import * as React from 'react';
import { Grid, GridItem, Paper, Stack, Text } from '@tidy-ui/all';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faBullseye,
  faRocket,
  faShieldHalved,
  faEarth,
  faScissors,
  faChartLine,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const features = [
  { title: 'Easy', emoji: faBullseye, desc: 'Minimal interface with simple input and one-click copy.' },
  { title: 'Fast', emoji: faRocket, desc: 'Shortens URLs in milliseconds. Optimized for speed and efficiency.' },
  { title: 'Reliable', emoji: faCircleCheck, desc: 'Backed by a resilient cloud platform with 99.9% uptime.' },
  { title: 'Secure', emoji: faShieldHalved, desc: 'All links use HTTPS and include safeguards against misuse.' },
  { title: 'Always Available', emoji: faEarth, desc: 'Your short links work 24/7 with global delivery via CDN.' },
  { title: 'Shortened', emoji: faScissors, desc: 'Clean, concise URLs perfect for sharing anywhere.' },
  {
    title: 'Smart Analytics',
    emoji: faChartLine,
    desc: 'Track click-through rates and referrers with real-time insights',
  },
  {
    title: 'Customizable',
    emoji: faToolbox,
    desc: 'Logged in users can create branded or meaningful slugs for their URLs',
  },
];

export default function () {
  return (
    <Grid gap={32}>
      {features.map((feature, index) => (
        <GridItem key={index} xl={6} lg={6} md={6} sm={12} xs={12}>
          <Paper height="200px">
            <Stack order="column" align="center" gap="0.5rem">
              <Text.H4 ctr margin="0.5rem">
                <FontAwesomeIcon icon={feature.emoji} />
              </Text.H4>
              <Text.Subtitle2 ctr>{feature.title}</Text.Subtitle2>
              <Text.Body2 ctr>{feature.desc}</Text.Body2>
            </Stack>
          </Paper>
        </GridItem>
      ))}
    </Grid>
  );
}
