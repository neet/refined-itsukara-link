import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { styled } from 'src/styles';
import { useFetchTeamsQuery } from 'src/generated/graphql';
import { Team } from 'src/components/team';
import { Card } from 'src/components/card';
import { Page } from 'src/components/page';

const Title = styled.h2`
  margin: 8px 0;
  font-size: 21px;
`;

const List = styled.ul`
  margin: 18px 0;
`;

const ListItem = styled.li`
  width: 100%;
  margin-bottom: 12px;
`;

export const Teams = React.memo(() => {
  const { t } = useTranslation();
  const { data, loading } = useFetchTeamsQuery();

  return (
    <>
      <Helmet>
        <title>
          {t('teams.page_title', {
            defaultValue: 'Collaboration of Nijisanji - Refined Itsukara.link',
          })}
        </title>
      </Helmet>

      <Page>
        <Title>{t('teams.title', { defaultValue: 'Collaboration' })}</Title>
        <p>
          {t('teams.description', {
            defaultValue: 'List of collaborations of Nijisanji',
          })}
        </p>

        <List>
          {loading
            ? Array.from({ length: 10 }, (_, i) => (
                <ListItem key={`placeholder-${i}`}>
                  <Card>
                    <Team loading withPerformerNames />
                  </Card>
                </ListItem>
              ))
            : data &&
              data.teams.nodes.map(team => (
                <ListItem key={team.id}>
                  <Card>
                    <Team team={team} withPerformerNames />
                  </Card>
                </ListItem>
              ))}
        </List>
      </Page>
    </>
  );
});
