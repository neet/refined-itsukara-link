import querystring from 'querystring';
import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'src/styles';
import { PerformerFragment } from 'src/generated/graphql';
import { Avatar } from './avatar';

const Meta = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Description = styled.p`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.foregroundLight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Wrapper = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.foregroundNormal};

  &:hover {
    text-decoration: none;

    ${Name} {
      text-decoration: underline;
    }
  }

  & > img {
    flex: 0 0 auto;
    margin-right: 8px;
  }
`;

interface PerformerProps {
  performer: PerformerFragment;
  withDescription?: boolean;
}

export const Performer = (props: PerformerProps) => {
  const { performer, withDescription } = props;
  const { id, name, description } = performer;

  return (
    <Wrapper
      to={{
        pathname: '/activities',
        search: querystring.stringify({ performer_id: id }),
      }}
    >
      <Avatar size={36} performer={performer} background="performerColor" />

      <Meta>
        <Name>{name}</Name>
        {withDescription && <Description>{description}</Description>}
      </Meta>
    </Wrapper>
  );
};
