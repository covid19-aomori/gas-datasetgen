import { JSONGenerator } from './JSONGenerator'

const properties = PropertiesService.getScriptProperties();
const AWS_KEY = properties.getProperty("AWS_KEY");
const AWS_SECRET = properties.getProperty("AWS_SECRET");
const BUCKET_NAME = properties.getProperty("BUCKET_NAME");

function genDataset(): void {
  const ok = Browser.msgBox('S3にデータセットをアップしますがよろしいですか??', Browser.Buttons.OK_CANCEL)
  if (ok !== 'ok') {
    Browser.msgBox("実行をキャンセルしました")
    return
  }

  const generator = new JSONGenerator()
  const data = generator.genAll()
  Logger.log(data)

  const s3 = S3.getInstance(AWS_KEY, AWS_SECRET)
  s3.putObject(
    BUCKET_NAME,
    'data.json',
    Utilities.newBlob(data, 'text/json', 'UTF-8'),
    { logRequests:true }
  )
  Browser.msgBox('S3にデータセットをアップしました')

  return
}

function debugDataset(): void {
  const generator = new JSONGenerator()
  const data = generator.genAll()

  Browser.msgBox(data)

  return
}
