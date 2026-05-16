package model

type StatisticsSummary struct {
	LatestBloodPressure *UserBloodPressure      `json:"latestBloodPressure"`
	LatestWeight        *WeightRecord           `json:"latestWeight"`
	LatestTemperature   *UserTemperatureRecord  `json:"latestTemperature"`
	LatestHeight        *UserHeightVO           `json:"latestHeight"`
	BloodPressureTrend  []*UserBloodPressure    `json:"bloodPressureTrend"`
	WeightTrend         []*WeightRecord         `json:"weightTrend"`
	TemperatureTrend    []*UserTemperature      `json:"temperatureTrend"`
}
