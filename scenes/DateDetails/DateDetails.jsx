import React, { useState } from 'react';
import InternalLink from 'next/link';
import ReactGA from 'react-ga';
import MarkdownIt from 'markdown-it';
import Image from 'next/image';

import styles from './DateDetails.module.css';
import Spinner from '../../components/Spinner/Spinner';
import Chip from '../../components/Chip/Chip';
import constants from '../../constants';
import {
  getDateCost,
  getDateLength,
  getDateTags,
  filterArrayToString,
  useThumbnail,
} from '../../utils';
import cn from '../../utils/cn';
import LikeButton from '../../components/LikeButton/LikeButton';
import Store from '../../store';

const placeholderImg1 = '/assets/graphics/pattern-1.svg';
const placeholderImg2 = '/assets/graphics/pattern-2.svg';
const placeholderImg3 = '/assets/graphics/pattern-3.svg';
const placeholderImg4 = '/assets/graphics/pattern-4.svg';

const mdParser = new MarkdownIt();

const placeholderImgs = [placeholderImg1, placeholderImg2, placeholderImg3, placeholderImg4];

const randPlaceholder = () => placeholderImgs[Math.floor(Math.random() * Math.floor(4))];

const DateDetails = ({ dateObj }) => {
  if (!dateObj) {
    return <Spinner />;
  }

  const dateLength = getDateLength(dateObj);
  const tags = getDateTags(dateObj);
  const dateCost = getDateCost(dateObj);
  const store = Store.useStore();
  const lastFilters = store.get('lastFilters');
  const filterString = filterArrayToString(lastFilters);
  const backUrl = lastFilters.length
    ? `${constants.PAGES.SEARCH}?filters=${filterString}`
    : constants.PAGES.SEARCH;

  const backEvent = () =>
    ReactGA.event({
      category: 'Interaction',
      action: 'Click Back to Explore',
    });

  const SectionImage = ({ section }) => {
    const [placeholder] = useState(randPlaceholder());
    const [highResLoaded, setHighResLoaded] = useState(false);
    const imageUrl = useThumbnail(section);

    return (
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnail}>
          <Image
            unsized
            alt=""
            className={styles.thumbnailImage}
            src={imageUrl}
            onLoad={() => {
              setHighResLoaded(true);
            }}
          />
          <Image
            unsized
            alt=""
            className={cn(
              styles.thumbnailImage,
              styles.thumbnailPlaceholder,
              highResLoaded && styles.thumbnailPlaceholderClear,
            )}
            src={placeholder}
          />
        </div>
        {section.image && section.imageAuthor && (
          <span className={styles.imageAuthor}>
            Photo:{' '}
            <ReactGA.OutboundLink
              to={`https://www.instagram.com/p/${section.image}`}
              target="_blank"
              rel="noopener noreferrer"
              eventLabel={`Instagram post by ${section.imageAuthor}`}
            >
              {`@${section.imageAuthor}`}
            </ReactGA.OutboundLink>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <InternalLink href={backUrl}>
          <a onClick={backEvent} className="link">
            ← Back to Explore
          </a>
        </InternalLink>
      </div>
      <h3 className={styles.dateTitle}>
        {dateObj.name}{' '}
        {dateObj.new && (
          <span className={styles.newTag}>
            <Chip variant={Chip.VARIANTS.PRIMARY}>NEW</Chip>
          </span>
        )}
      </h3>
      <div className={styles.thumbnailRowContainer}>
        {dateObj.sections.map(section => (
          <SectionImage key={section.spot.name} section={section} />
        ))}
      </div>
      <div className={styles.metaRow}>
        <div className={styles.metaData}>
          <div className={styles.timeAndCost}>
            {dateLength} hours · {dateCost}
          </div>
          <div className={styles.tagsContainer}>
            {tags.map(tag => (
              <div key={tag.tagId} className={styles.tag}>
                <Chip>{tag.name}</Chip>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.spacer} />
        <LikeButton dateObj={dateObj} />
        {/* <CommentButton /> */}
      </div>
      <p className={styles.description}>{dateObj.description}</p>
      <div className={styles.lineBreak} />
      <ol className={styles.sectionList}>
        {dateObj.sections.map((section, index) => {
          return (
            <li className={styles.sectionListItem} key={section.spot.name}>
              <div className={styles.bullet} />
              <h5 className={styles.activityHeader}>
                {['FIRST', 'SECOND', 'THIRD'][index]} ACTIVITY
              </h5>
              <h6 className={styles.activityTitle}>{section.spot.name}</h6>
              <p className={styles.activityDescription}>{section.description}</p>
              {section.tips && (
                <div className={styles.tipsBox}>
                  <h6 className={styles.tipsTitle}>
                    <Image
                      width="20px"
                      height="20px"
                      alt="A small orange flower decorating the tips section."
                      className={styles.tipFlower}
                      src="/assets/graphics/tip-flower.svg"
                    />
                    Tips & Tricks
                  </h6>
                  <div dangerouslySetInnerHTML={{ __html: mdParser.render(section.tips) }}></div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className={styles.backButtonMobile}>
        <InternalLink href={backUrl}>
          <a onClick={backEvent} className="link">
            ← Back to Explore
          </a>
        </InternalLink>
      </div>
    </div>
  );
};

export default DateDetails;
