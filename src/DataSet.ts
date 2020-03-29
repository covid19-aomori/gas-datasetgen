export type Patient = {
  date: string
  data: {
    リリース日: string
    居住地: string
    年代: string
    性別: '男性' | '女性'
    退院: null | '○'
    date: string
    source: string
  }[]
}

export type PatientsSummary = {
  date: string
  data: {
    日付: string,
    小計: string
  }[]
}

export type InspectionsSummary = {
  date: string
  data: {
      県内: number[]
      その他: number[]
  }
  labels: string[]
}

export type InspectionPerson = {
  date: string
  labels: string[]
  datasets: {
    label: '検査実施人数'
    data: number[]
  }[]
}

export type InspectionStatusSummary = {
  date: string
  attr: '検査実施人数（累計）'
  value: number
  children: {
    attr: '検査実施件数（累計）'
    value: number
    children: {
      attr: '県内発生' | 'その他（チャーター便・クルーズ船等）'
      value: number
    }[]
  }[]
}
