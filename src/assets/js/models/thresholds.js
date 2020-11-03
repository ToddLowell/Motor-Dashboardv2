import axios from '@/axios';
import store from '@/store';

export default async () => {
  const res = await axios(store.state.api.threshold);
  const result = res.data;

  // temp
  const tempMininimum = parseFloat(result.tempMininimum);
  const tempSatatisfactory = parseFloat(result.tempSatatisfactory);
  const tempUnsatisfactory = parseFloat(result.tempUnsatisfactory);
  const tempCritical = parseFloat(result.tempCritical);

  // power
  const powerMininimum = parseFloat(result.powerMininimum);
  const powerSatistactory = parseFloat(result.powerSatistactory);
  const powerUnsatisfactory = parseFloat(result.powerUnsatisfactory);
  const powerCritical = parseFloat(result.powerCritical);

  // 1 = good/min
  // 2 = satisfactory
  // 3 = unsatisfactory
  // 4 = unacceptable/critical
  return {
    vrms_2: 0.71,
    vrms_3: 1.8,
    vrms_4: 4.5,

    watt_1: powerMininimum,
    watt_2: powerSatistactory,
    watt_3: powerUnsatisfactory,
    watt_4: powerCritical,

    temp_1: tempMininimum,
    temp_2: tempSatatisfactory,
    temp_3: tempUnsatisfactory,
    temp_4: tempCritical,

    batt_2: 75,
    batt_3: 50,
    batt_4: 25
  };
};
