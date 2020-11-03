import getThresholds from './models/thresholds';
import { init } from './models/Charts';

export default async function() {
  // get thresholds
  var thresholds = await getThresholds();

  // setup all motors
  init(thresholds);
}
