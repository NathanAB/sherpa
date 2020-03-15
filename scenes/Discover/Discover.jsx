import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Store from '../../store';
import { filterDates, useDesktop } from '../../utils';
import FilterBar from './FilterBar/FilterBar';
import DatesList from './DatesList/DatesList';
import NeighborhoodsRow from './NeighborhoodsRow/NeighborhoodsRow';
import DatesRow from './DatesRow/DatesRow';
import TagsRow from './TagsRow/TagsRow';
import DateCard from '../../components/DateCard/DateCard';
import HeroImage from '../../assets/img/dc-3.jpeg';

const styles = () => ({
  listContainer: {
    padding: '0px 20px',
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    padding: '0px 20px',
  },
  title: {
    fontWeight: 600,
  },
  hero: {
    top: '0px',
    height: '370px',
    left: '0px',
    right: '0px',
    display: 'flex',
    justifyContent: 'center',
    '&::before': {
      content: '""',
      top: '0px',
      height: '440px',
      position: 'absolute',
      left: '0px',
      right: '0px',
      // background: `linear-gradient(to bottom, rgba(186,48,13,0.5) 0%, rgba(186,48,13,0.5) 100%), url(${HeroImage})`,
      background: `linear-gradient(to bottom, rgba(186,48,13,0.2) 0%, rgba(186,48,13,0.2) 100%), url(${HeroImage})`,
      // background: `url(${HeroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top',
    },
  },
  heroContent: {
    width: '100%',
    maxWidth: '1050px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingBottom: '20px',
  },
  heroTitle: {
    zIndex: 2,
    fontWeight: 600,
    lineHeight: '64px',
  },
  spacer: {
    height: '350px',
  },
});

function Discover({ classes }) {
  const focusedRef = useRef(null);
  const isDesktop = useDesktop();

  const store = Store.useStore();
  const filters = store.get('filters');
  const dates = store.get('dates');
  const focusedDate = store.get('focusedDate');

  const filteredDates = filterDates(dates, filters);
  const dateCards = filteredDates.map(date => {
    const isFocusedDate = parseInt(focusedDate, 10) === date.id;
    return (
      <DateCard
        key={date.id}
        dateObj={date}
        defaultExpanded={isDesktop}
        ref={isFocusedDate ? focusedRef : null}
      />
    );
  });

  // Scroll to focused date when clicked on Discover landing page
  useEffect(() => {
    if (focusedDate) {
      window.scrollTo(0, focusedRef.current ? focusedRef.current.offsetTop - 100 : 0);
    }
  }, [focusedDate, focusedRef]);

  function renderContent() {
    if (filters.length || focusedDate) {
      return (
        <>
          <FilterBar />
          <Box className={classes.listContainer}>
            <DatesList>{dateCards}</DatesList>
          </Box>
        </>
      );
    }

    return (
      <Box>
        <Box className={classes.hero}>
          <Box className={classes.heroContent}>
            <Typography color="secondary" align="center" variant="h3" className={classes.heroTitle}>
              Got a date? <br /> We&apos;ve got you covered
            </Typography>
            <FilterBar />
          </Box>
        </Box>
        <DatesRow />
        <NeighborhoodsRow />

        <Box className={classes.tagsContainer}>
          <Typography variant="h6" className={classes.title}>
            Dates by Characteristic
          </Typography>
          <TagsRow isDiscover />
        </Box>
      </Box>
    );
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}

export default withStyles(styles)(Discover);
