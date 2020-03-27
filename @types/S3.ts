declare class S3 {
  public static getInstance(key:string, secret:string): S3
  public putObject(bucket:string, fileName:string, data:GoogleAppsScript.Base.Blob, option:any)
}
