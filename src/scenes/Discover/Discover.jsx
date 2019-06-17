import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

import Store from '../../store';
import FilterBar from './FilterBar/FilterBar';
import DatesList from './DatesList/DatesList';
import NeighborhoodsRow from './NeighborhoodsRow/NeighborhoodsRow';
import DatesRow from './DatesRow/DatesRow';
import TagsRow from './TagsRow/TagsRow';
import DateObjs from '../../mocks/dates';
import DateCard from '../../components/DateCard/DateCard';
import FilterPage from './FilterPage/FilterPage';

/**
 * Filter dates on one or more tags
 * @param {Array<DateObj>} dateObjs Array of date objects
 * @param {Array<String>} tags Arrayt of tags to filter on
 */
function getDatesByTags(dateObjs, tags) {
  return dateObjs.filter(date => {
    if (!tags.length) {
      return true;
    }

    return (
      tags.filter(tagFilter =>
        date.sections.find(section => section.tags.find(tag => tag.name === tagFilter)),
      ).length === tags.length
    );
  });
}

function Discover({ onAddDate }) {
  const [tagFilters, setTagFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [costFilters, setCostFilters] = useState([]);

  const store = Store.useStore();
  const filters = store.get('filters');
  const isFilterPageOpen = store.get('isFilterPageOpen');
  const dates = store.get('dates');

  const dateCards = dates.map(date => <DateCard dateObj={date} />);

  const toggleTag = value => () => {
    const currentIndex = tagFilters.indexOf(value);
    const newTagFilters = [...tagFilters];

    if (currentIndex === -1) {
      newTagFilters.push(value);
    } else {
      newTagFilters.splice(currentIndex, 1);
    }

    setTagFilters(newTagFilters);
  };

  const toggleLocationFilter = value => () => {
    const currentIndex = locationFilters.indexOf(value);
    const newLocationFilters = [...locationFilters];

    if (currentIndex === -1) {
      newLocationFilters.push(value);
    } else {
      newLocationFilters.splice(currentIndex, 1);
    }

    setLocationFilters(newLocationFilters);
  };

  const toggleCostFilter = value => () => {
    const currentIndex = costFilters.indexOf(value);
    const newCostFilters = [...costFilters];

    if (currentIndex === -1) {
      newCostFilters.push(value);
    } else {
      newCostFilters.splice(currentIndex, 1);
    }

    setCostFilters(newCostFilters);
  };

  function renderContent() {
    if (isFilterPageOpen) {
      return <FilterPage />;
    }

    if (filters.length) {
      return <DatesList>{dateCards}</DatesList>;
    }

    return (
      <>
        <DatesRow />
        <NeighborhoodsRow />

        <Typography variant="h6">Explore by Characteristic</Typography>
        <TagsRow />
      </>
    );
  }

  return (
    <React.Fragment>
      <FilterBar
        toggleTag={toggleTag}
        tagFilters={tagFilters}
        toggleLocationFilter={toggleLocationFilter}
        locationFilters={locationFilters}
        toggleCostFilter={toggleCostFilter}
        costFilters={costFilters}
      />

      {renderContent()}

      {/* {dateComponents.length ? (
        <DateCardContainer tagFilters={tagFilters}>{dateComponents}</DateCardContainer>
      ) : (
        <Typography variant="h6" align="center">
          No date plans meet your criteria :(
        </Typography>
      )} */}
    </React.Fragment>
  );
}

Discover.propTypes = {
  onAddDate: PropTypes.func,
};

Discover.defaultProps = {
  onAddDate: () => {},
};

export default Discover;
