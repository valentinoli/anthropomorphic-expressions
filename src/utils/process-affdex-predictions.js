export default (results) => {
  // Function for processing results object of AFFDEX prediction values
  // Returns a nicely formatted object with less redundancy
  const data = {}

  if (results && results.length > 0) {
    // Initialization
    Object.entries(results[0]).forEach(([key1, val1]) => {
      // {key1: val} --> { appearance: {...}, expressions: {...}, ...}
      data[key1] = {}

      Object.keys(val1).forEach((key2) => {
        // [key2] --> glasses, gender, browRaise, etc.
        data[key1][key2] = []
      })
    })

    // Feed results into new data object
    results.forEach((res) => {
      Object.entries(res).forEach(([key1, val1]) => {
        Object.entries(val1).forEach(([key2, val2]) => {
          if (typeof (val2) === 'number') {
            data[key1][key2].push(Number(val2.toFixed(0)))
          } else {
            data[key1][key2].push(val2)
          }
        })
      })
    })
  }

  return data
}
