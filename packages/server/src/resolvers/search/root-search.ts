import * as G from 'src/generated/graphql';
import { indices } from 'src/elasticsearch';
import { serializePerformer } from 'src/serializers/performer';
import { serializeActivity } from 'src/serializers/activity';
import { serializeTeam } from 'src/serializers/team';
import { serializeCategory } from 'src/serializers/category';
import { Activity } from 'src/entity/activity';
import { Performer } from 'src/entity/performer';
import { Team } from 'src/entity/team';
import { Category } from 'src/entity/category';

export const rootSearch: G.QueryResolvers['search'] = async (
  _,
  { query },
  { loaders, elasticsearch },
) => {
  const activities = await elasticsearch
    .search({
      index: indices.activity,
      type: '_doc',
      body: {
        query: {
          query_string: {
            fields: ['name'],
            query,
          },
        },
      },
    })
    .then((result) =>
      result.body.hits.hits.map((hit: { _id: string }) => hit._id),
    )
    .then((ids) =>
      loaders.activity
        .loadMany(ids)
        .then((results) =>
          results
            .filter(
              (activity): activity is Activity => !(activity instanceof Error),
            )
            .map((activity) => serializeActivity(activity)),
        ),
    );

  const performers = await elasticsearch
    .search({
      index: indices.performers,
      type: '_doc',
      body: {
        query: {
          query_string: {
            fields: ['name'],
            query,
          },
        },
      },
    })
    .then((result) =>
      result.body.hits.hits.map((hit: { _id: string }) => hit._id),
    )
    .then((ids) =>
      loaders.performer
        .loadMany(ids)
        .then((results) =>
          results
            .filter(
              (performer): performer is Performer =>
                !(performer instanceof Error),
            )
            .map((performer) => serializePerformer(performer)),
        ),
    );

  const teams = await elasticsearch
    .search({
      index: indices.team,
      type: '_doc',
      body: {
        query: {
          query_string: {
            fields: ['name'],
            query,
          },
        },
      },
    })
    .then((result) =>
      result.body.hits.hits.map((hit: { _id: string }) => hit._id),
    )
    .then((ids) =>
      loaders.team
        .loadMany(ids)
        .then((results) =>
          results
            .filter((team): team is Team => !(team instanceof Error))
            .map((team) => serializeTeam(team)),
        ),
    );

  const categories = await elasticsearch
    .search({
      index: indices.category,
      type: '_doc',
      body: {
        query: {
          query_string: {
            fields: ['name'],
            query,
          },
        },
      },
    })
    .then((result) =>
      result.body.hits.hits.map((hit: { _id: string }) => hit._id),
    )
    .then((ids) =>
      loaders.category
        .loadMany(ids)
        .then((results) =>
          results
            .filter(
              (category): category is Category =>
                !(category instanceof Category),
            )
            .map((category) => serializeCategory(category)),
        ),
    );

  return {
    performers,
    activities,
    teams,
    categories,
  };
};
