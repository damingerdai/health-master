import { UserBloodPressure } from "./user-blood-pressure";
import { WeightRecord } from "./weight-record";
import { UserTemperature } from "./user-temperature";

export interface StatisticsSummary {
  latestBloodPressure: UserBloodPressure | null;
  latestWeight: WeightRecord | null;
  latestTemperature: UserTemperature | null;
  latestHeight: { height: number; recordDate: string } | null;
  bloodPressureTrend: UserBloodPressure[];
  weightTrend: WeightRecord[];
  temperatureTrend: UserTemperature[];
}
