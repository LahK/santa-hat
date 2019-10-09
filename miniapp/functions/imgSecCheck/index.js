// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileContent } = await cloud.downloadFile({
    fileID: event.fileID,
  })

  return cloud.openapi.security
    .imgSecCheck({
      media: {
        contentType: event.type,
        value: fileContent
      }
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    })
}