/**
 * @module video
 * @license MIT
 * @version 2018/01/09
 */

import Events from './events';
import { inherits } from './utils';

export default function Video(video) {
  this.video = video;
}

inherits(Video, Events);
