import classNames from 'classnames';
import dayjs from 'dayjs';
import type { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { useLocalStorage, useSearchParam } from 'react-use';

import { api } from '../api';
import { ChangeLog } from '../components/app/ChangeLog';
import { Crown } from '../components/app/Crown';
import { EventMarker } from '../components/app/EventMarker';
import { Skyscraper } from '../components/app/Skyscraper';
import { Tutorial } from '../components/app/Tutorial';
import { useEvents } from '../components/hooks/useEvents';
import { useGenres } from '../components/hooks/useGenres';
import { useUpcomingEvents } from '../components/hooks/useUpcomingEvents';
import type { TimetableProps } from '../components/ui/Timetable';
import { TimetableProvider } from '../components/ui/Timetable';
import Single from '../layouts/Single';
import type { GenresResponse } from '../types';

const Timetable = dynamic<TimetableProps>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  async () => import('../components/ui/Timetable').then((m) => m.Timetable),
  { ssr: false },
);

const GENRE_ALL = -1;
const DAILY = 86400;

// if you use this hook other than here, make this a module.
const useGenreQueryParam = (): number | undefined => {
  const queryGenre = useSearchParam('genre');
  return queryGenre != null ? Number(queryGenre) : undefined;
};

export interface EventsProps {
  readonly data: GenresResponse;
}

export const getStaticProps: GetStaticProps<EventsProps> = async () => {
  return {
    props: {
      data: await api.fetchGenres(),
    },
    revalidate: DAILY,
  };
};

const Events = (props: EventsProps): JSX.Element => {
  const { events, loading } = useEvents();
  const upcomingEvents = useUpcomingEvents();
  const [swapDelta] = useLocalStorage<boolean>('swap-delta');
  const genreQuery = useGenreQueryParam();
  const [genre, setGenre] = useState(genreQuery ?? GENRE_ALL);
  const { genres } = useGenres({ initialData: props.data });

  const startAt = events ? dayjs(events[0].start_date) : dayjs();
  const endAt = events ? dayjs(events[events.length - 1].end_date) : dayjs();

  // prettier-ignore
  const schedules = useMemo(() => (
   events 
      ?.filter((event) => genre === GENRE_ALL || event.genre?.id === genre)
      .map((event) => ({
        startAt: dayjs(event.start_date),
        endAt: dayjs(event.end_date),
        node: <EventMarker event={event} />,
      }))
    ?? []
  ), [events, genre]);

  return (
    <>
      <Head>
        <title>にじさんじの配信一覧 | Refined Itsukara.link</title>
        <meta
          name="description"
          content="にじさんじライバーの最近の配信の一覧です"
        />
      </Head>
      <TimetableProvider
        startAt={startAt}
        endAt={endAt}
        interval={30}
        scale={5}
        itemHeight={61.5}
      >
        <div
          className={classNames(
            'absolute', // TODO: separate
            'box-border',
            'flex',
            'top-0',
            'left-0',
            'py-2',
            'px-3',
            'w-full',
            'h-full',
            'md:px-6',
            'md:py-4',
            'md:space-x-4',
          )}
        >
          <div className="flex flex-col flex-grow space-y-2 md:space-y-4">
            <Crown
              genre={genre}
              loading={loading}
              onGenreChange={setGenre}
              genres={genres}
            />

            <Timetable
              loading={events == null}
              swapDelta={swapDelta}
              schedules={schedules}
            />
          </div>
          <Skyscraper pinnedEventId={48139} upcomingEvents={upcomingEvents} />
        </div>
      </TimetableProvider>

      {typeof window !== 'undefined' && (
        <>
          <Tutorial />
          <ChangeLog />
        </>
      )}
    </>
  );
};

Events.Layout = Single;

export default Events;
