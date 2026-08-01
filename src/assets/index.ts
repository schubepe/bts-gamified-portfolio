// Main assets module

import profile1 from './book-photo-1.webp';
import profile2 from './book-photo-2.webp';
import profile3 from './book-photo-3.webp';


import {
  stickers,
  stickersWebp,
} from './stickers';

// Re-export other asset modules
export * from './project_icons';
export * from './techstack';

// Named exports used by components
export {
  profile1,
  profile2,
  profile3,
  stickers,
  stickersWebp,
};

export const mainAssets = {
  profile1,
  profile2,
  profile3,
  stickers,
  stickersWebp,
};

export default {
  mainAssets,
};
