import {
  Patient,
  PatientsSummary,
  InspectionsSummary,
  InspectionPerson,
  InspectionStatusSummary
} from './dataset'

export class JSONGenerator {
  patientSheet: any
  otherSheet: any
  now: Date

  constructor(){
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    this.patientSheet = ss.getSheetByName('patient')
    this.otherSheet = ss.getSheetByName('other')
    this.now = new Date()
  }

  public genAll(): string {
    return `{
      "lastUpdate": "${this.formatDate(this.now)}",
      "patients": ${this.genPatient()},
      "patients_summary": ${this.genPatientsSummary()},
      "inspections_summary": ${this.genInspectionsSummary()},
      "inspection_persons": ${this.genInspectionPerson()},
      "inspection_status_summary": ${this.genInspectionStatusSummary()}
    }`.trim()
  }

  public genPatient(): string {
    const data:{ リリース日: string, 居住地: string, 性別: "男性" | '女性', 年代: string, 退院: null | '○', date: string, source: string }[] = []

    const lastRow = this.patientSheet.getLastRow()
    for (let i = 2; i <= lastRow; i++) {
      data.push({
        リリース日: this.formatDate(this.patientSheet.getRange(i, 1).getValue(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        居住地: this.patientSheet.getRange(i, 2).getValue(),
        年代: this.patientSheet.getRange(i, 3).getValue(),
        性別: this.patientSheet.getRange(i, 4).getValue(),
        退院: this.patientSheet.getRange(i, 5).getValue() ? '○' : null,
        date: this.formatDate(this.patientSheet.getRange(i, 6).getValue()),
        source: this.patientSheet.getRange(i, 7).getValue()
      })
    }

    const result:Patient = {
      date: this.formatDate(this.now),
      data
    }

    return JSON.stringify(result)
  }

  public genPatientsSummary(): string {
    const data:{ 日付: string, 小計: string }[] = []

    const lastRow = this.otherSheet.getLastRow()
    for (let i = 2; i <= lastRow; i++) {
      const date = this.formatDate(this.otherSheet.getRange(i, 1).getValue())
      const positive = this.otherSheet.getRange(i, 7).getValue()

      if (positive !== '') {
        data.push({
          日付: date,
          小計: positive
        })
      }
    }

    const result:PatientsSummary = {
      date: this.formatDate(this.now),
      data
    }

    return JSON.stringify(result)
  }

  public genInspectionsSummary(): string {
    const prefectures:number[] = []
    const others:number[] = []
    const labels:string[] = []

    const lastRow = this.otherSheet.getLastRow()
    for (let i = 2; i <= lastRow; i++) {
      const date = this.formatDate(this.otherSheet.getRange(i, 1).getValue(), 'M/dd')
      const today = this.otherSheet.getRange(i, 5).getValue()
      // TODO: 現状項目がないので発生したら考える
      const other = 0

      if (today !== '') {
        prefectures.push(today)
        others.push(other)
        labels.push(date)
      }
    }

    const result:InspectionsSummary = {
      date: this.formatDate(this.now),
      data: {
        県内: prefectures,
        その他: others
      },
      labels
    }

    return JSON.stringify(result)
  }

  public genInspectionPerson(): string {
    const data:number[] = []
    const labels:string[] = []

    const lastRow = this.otherSheet.getLastRow()
    for (let i = 2; i <= lastRow; i++) {
      const date = this.formatDate(this.otherSheet.getRange(i, 1).getValue(), "yyyy-MM-dd'T'HH:mm:ss'Z'")
      const today = this.otherSheet.getRange(i, 5).getValue()

      if (today !== '') {
        data.push(today)
        labels.push(date)
      }
    }

    const result:InspectionPerson = {
      date: this.formatDate(this.now),
      labels,
      datasets: [{
        label: '検査実施人数',
        data
      }]
    }

    return JSON.stringify(result)
  }

  public genInspectionStatusSummary(): string {
    const lastRow = this.otherSheet.getLastRow()
    const total = this.otherSheet.getRange(lastRow, 2).getValue()
    const positiveTotal = this.otherSheet.getRange(lastRow, 4).getValue()

    const result:InspectionStatusSummary = {
      date: this.formatDate(this.now),
      attr: '検査実施人数（累計）',
      value: total,
      children: [
        {
          attr: '検査実施件数（累計）',
          value: total,
          children: [
            {
              attr: '県内発生',
              value: positiveTotal
            },
            {
              attr: 'その他（チャーター便・クルーズ船等）',
              // TODO: 現状項目がないので発生したら考える
              value: 0
            }
          ]
        }
      ]
    }

    return JSON.stringify(result)
  }

  private formatDate(date:any, format = 'yyyy/MM/dd HH:mm'): string {
    return Utilities.formatDate(date, 'JST', format)
  }
}
