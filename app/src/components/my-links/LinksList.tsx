import { Anchor, FlexBox, FlexItem, Panel, PanelBody, PanelGroup, PanelHeader, Text, Tooltip } from '@tidy-ui/all';

import { MainLoader, UrlShortenerForm } from '@/components';
import { useGetMyLinks } from '@/hooks';

export default function () {
  const { data, isSuccess, isPending } = useGetMyLinks();
  if (isPending) return <MainLoader />;
  if (isSuccess)
    return (
      <FlexBox fld="column" gap="1rem" margin="2rem 0">
        <FlexItem fuw>
          <PanelGroup hasSeparator>
            {data.items.map((link) => (
              <Panel key={link.uid}>
                <PanelHeader>
                  <FlexBox jsc="space-between" ali="center" width="100%">
                    <Text.H6>
                      <Tooltip aria-label="Click to expand">
                        <code>/{link.uid}</code>
                      </Tooltip>
                    </Text.H6>
                    <Anchor href={`/${link.uid}`} canLaunch girth="lg" />
                  </FlexBox>
                </PanelHeader>
                <PanelBody>
                  <Text.Body1>{`Created on ${new Date(link.createdAt).toUTCString()}`}</Text.Body1>
                </PanelBody>
              </Panel>
            ))}
          </PanelGroup>
        </FlexItem>
        <FlexItem fuw>
          <UrlShortenerForm />
        </FlexItem>
      </FlexBox>
    );
  return <FlexBox>LinksList</FlexBox>;
}
