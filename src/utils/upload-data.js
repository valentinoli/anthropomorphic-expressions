import putObject from './aws'
import { getItem, setItem } from './local-storage'

const stepError = (step) => new Error(`Step ${step} incomplete`)

export default async () => {
  const data = {
    video: {},
    survey: {}
  }

  const videoIds = [1, 2]

  videoIds.forEach((num) => {
    const key = `video_${num}`
    const item = getItem(key)
    if (!item) {
      throw stepError(key)
    }
    data.video[num] = JSON.parse(item)
  })

  videoIds.forEach((num) => {
    const key = `survey_${num}`
    const item = getItem(key)
    if (!item) {
      throw stepError(key)
    }
    data.survey[num] = JSON.parse(item)
  })

  const keys = ['general', 'aq10', 'sqpb']
  keys.forEach((key) => {
    const val = getItem(key)
    if (!val) {
      throw stepError(key)
    }

    data[key] = JSON.parse(val)
  })

  const json = JSON.stringify(data)

  // Save data in local storage just in case
  setItem('data', json)

  // Upload to AWS S3
  const putResult = await putObject(json)
  return putResult
}
