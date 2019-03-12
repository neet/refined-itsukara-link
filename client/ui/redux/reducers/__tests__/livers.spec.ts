import { liversReducer } from 'client/ui/redux/reducers/livers';
import { fetchEventsProcess } from 'client/ui/redux/actions/events';

describe('livers reducer', () => {
  test('stores livers from list of events', () => {
    const pseudoEvents = [
      {
        id: 1053,
        name:
          '【13日の金曜日】ジェイソンから逃げきれ！はじめてのFriday the 13th: The Game【にじさんじ/椎名唯華】',
        description:
          'にじさんじゲーマーズ出身の椎名唯華です。 よろしくおねがいします！ メンバー：https://gaming.youtube.com/channel/UC... ボイス：https://nijisanji.booth.pm/items/1206682 twitter：https://twitter.com/yuika_siina',
        public: 1,
        url: 'https://www.youtube.com/watch?v=fH1ZdAWKEGU',
        start_date: '2019-02-28T00:30:00.000+09:00',
        end_date: '2019-02-28T01:30:00.000+09:00',
        recommend: false,
        liver: {
          id: 37,
          name: '椎名唯華',
          avatar:
            'https://s3-ap-northeast-1.amazonaws.com/liver-icons/400x400/Shiina_Yuika.png',
          color: '#F1C8DE',
        },
      },
    ];

    const state = liversReducer(
      undefined,
      fetchEventsProcess.done({ result: { events: pseudoEvents } }),
    );

    expect(state[37]).toEqual(pseudoEvents[0].liver);
  });
});
