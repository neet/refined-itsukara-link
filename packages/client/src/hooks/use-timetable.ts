import { useFetchActivitiesQuery, Order } from 'src/generated/graphql';
import { getTimetableRange } from 'src/components/timetable/utils';
import { useQueryParam, StringParam } from 'use-query-params';

export const useTimetable = () => {
  const [afterDate] = useQueryParam('after_date', StringParam);
  const [categoryId] = useQueryParam('category_id', StringParam);
  const [teamId] = useQueryParam('team_id', StringParam);
  const [performerId] = useQueryParam('performer_id', StringParam);

  const input = {
    afterDate,
    order: Order.Desc,
    categoryId,
    teamId,
    performerId,
  };

  const { data, loading, fetchMore } = useFetchActivitiesQuery({
    variables: { input },
    fetchPolicy: 'cache-and-network',
    ssr: false,
  });

  const onLoadNext = () => {
    if (!data || !data.activities) return;

    return fetchMore({
      variables: {
        input: {
          // prettier-ignore
          beforeDate: getTimetableRange(data.activities.nodes)
            .timetableStartAt
            .toISOString()
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          activities: {
            __typename: prev.activities.__typename,
            nodes: [
              ...prev.activities.nodes,
              ...fetchMoreResult.activities.nodes,
            ],
            pageInfo: fetchMoreResult.activities.pageInfo,
          },
        };
      },
    });
  };

  const onLoadPrevious = () => {
    if (!data || !data.activities) return;

    return fetchMore({
      variables: {
        input: {
          // prettier-ignore
          afterDate: getTimetableRange(data.activities.nodes)
            .timetableEndAt
            .toISOString()
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          activities: {
            __typename: prev.activities.__typename,
            nodes: [
              ...prev.activities.nodes,
              ...fetchMoreResult.activities.nodes,
            ],
            pageInfo: fetchMoreResult.activities.pageInfo,
          },
        };
      },
    });
  };

  return {
    activities: data && data.activities.nodes,
    loading,
    hasNextPage: data && data.activities.pageInfo.hasNextPage,
    hasPreviousPage: data && data.activities.pageInfo.hasPreviousPage,
    onLoadNext,
    onLoadPrevious,
  };
};
