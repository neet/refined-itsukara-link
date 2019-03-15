import React from 'react';
import { styled } from 'client/ui/styles';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { markerWidth } from 'client/ui/styles/constants';

export interface MinuteHandProps {
  startDate: Dayjs;
}

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  width: ${markerWidth}px;
  height: 100%;
`;

const Now = styled.div`
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 55px 16px 16px;
  padding: 4px 12px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.highlightNormal};
  color: ${({ theme }) => theme.foregroundReverse};
  font-size: 12px;
  font-weight: bold;
  text-align: center;

  & > svg {
    margin-right: 0.25em;
  }
`;

const Border = styled.div`
  display: flex;
  box-sizing: border-box;
  flex: 1 0 auto;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.highlightNormal};
`;

export const MinuteHand = (props: MinuteHandProps) => {
  const { startDate } = props;
  const { t } = useTranslation();
  const gapFromOrigin =
    (dayjs().diff(startDate, 'minute') * markerWidth) / 30 - markerWidth / 2;

  return (
    <Wrapper style={{ transform: `translateX(${gapFromOrigin}px)` }}>
      <Now>
        <FontAwesomeIcon icon={faFire} />
        {t('timeline.now', { defaultValue: 'LIVE' })}
      </Now>

      <Border />
    </Wrapper>
  );
};
