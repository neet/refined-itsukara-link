import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'src/styles';
import {
  SearchForm,
  Wrapper as SearchFormWrapper,
} from 'src/components/search-form';
import { Navigation } from 'src/components/navigation';
import { Link } from 'react-router-dom';
import logo from '@ril/arts/static/logo-small.png';
import { BANNER } from 'src/styles/z-indices';
import { ModalMenu } from './modal-menu';
import { CompactSearchForm } from './compact-search-form';

const Wrapper = styled.header`
  display: flex;
  position: relative;
  z-index: ${BANNER};
  box-sizing: border-box;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
  padding: 8px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.borderNormal};
  background-color: ${({ theme }) => theme.backgroundNormal};
`;

const LeftInner = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: flex-start;

  & > a {
    margin-right: 18px;
  }

  ${SearchFormWrapper} {
    width: 320px;
  }

  & > a,
  ${SearchFormWrapper} {
    display: none;

    @media screen and (min-width: 700px) {
      display: block;
    }
  }

  @media screen and (min-width: 700px) {
    justify-content: flex-start;
    margin-left: auto;
  }
`;

const CentreInner = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 700px) {
    display: none;
  }
`;

const LogoImage = styled.img`
  width: auto;
  height: 30px;
`;

const RightInner = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: flex-end;

  nav {
    display: none;

    @media screen and (min-width: 700px) {
      display: block;
    }
  }
`;

const Logo = () => {
  const { t } = useTranslation();

  return (
    <Link to="/">
      <LogoImage
        src={logo}
        alt={t('meta.title', { defaultValue: 'Refined Itsukara.link' })}
      />
    </Link>
  );
};

export const Banner = () => {
  return (
    <Wrapper>
      <LeftInner>
        {/* Desktop */}
        <Logo />
        <SearchForm withResult />
        {/* Mobile */}
        <ModalMenu />
      </LeftInner>
      {/* Mobile */}
      <CentreInner>
        <Logo />
      </CentreInner>
      <RightInner>
        {/* Desktop */}
        <Navigation />
        {/* Mobile */}
        <CompactSearchForm />
      </RightInner>
    </Wrapper>
  );
};
