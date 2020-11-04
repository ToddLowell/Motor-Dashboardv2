import getThresholds from './models/thresholds';
import { init, close } from './models/Charts';

export default async function() {
  // get thresholds
  var thresholds = await getThresholds();

  // setup all motors
  var intervals = init(thresholds);

  return intervals;
}

export { close };
