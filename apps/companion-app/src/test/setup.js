import '@testing-library/jest-dom';
import { __setCache } from '../data/staticData';
import slideDecks from '../../public/data/slideDecks.json';
import chapterData from '../../public/data/chapterData.json';
import timelessSongSlides from '../../public/data/timelessSongSlides.json';
import playbookData from '../../public/data/playbookData.json';
import dagNodes from '../../public/data/dagNodes.json';

__setCache({ slideDecks, chapterData, timelessSongSlides, playbookData, dagNodes });
