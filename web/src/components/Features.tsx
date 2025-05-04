import * as React from 'react';
import { Grid, GridItem, Paper, Stack, Text } from '@tidy-ui/all';

const features = [
  { title: 'Easy', emoji: '🎯', desc: 'Minimal interface with simple input and one-click copy.' },
  { title: 'Fast', emoji: '🚀', desc: 'Shortens URLs in milliseconds. Optimized for speed and efficiency.' },
  { title: 'Reliable', emoji: '🔁', desc: 'Backed by a resilient cloud platform with 99.9% uptime.' },
  { title: 'Secure', emoji: '🔐', desc: 'All links use HTTPS and include safeguards against misuse.' },
  { title: 'Always Available', emoji: '🌍', desc: 'Your short links work 24/7 with global delivery via CDN.' },
  { title: 'Shortened', emoji: '✂️', desc: 'Clean, concise URLs perfect for sharing anywhere.' },
  { title: 'Smart Analytics', emoji: '🧠', desc: 'Track click-through rates and referrers with real-time insights' },
  { title: 'Customizable', emoji: '🧰', desc: 'Logged in users can create branded or meaningful slugs for their URLs' },
];

export default function () {
  return (
    <Grid gap={32}>
      {features.map((feature, index) => (
        <GridItem key={index} xl={6} lg={6} md={6} sm={12} xs={12}>
          <Paper height="216px">
            <Stack order="column" align="center" gap="0.5rem">
              <Text.H2 ctr>{feature.emoji}</Text.H2>
              <Text.Subtitle2 ctr>{feature.title}</Text.Subtitle2>
              <Text.Body2 ctr>{feature.desc}</Text.Body2>
            </Stack>
          </Paper>
        </GridItem>
      ))}
    </Grid>
  );
}
