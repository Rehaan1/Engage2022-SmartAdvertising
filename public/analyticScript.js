const avgAge = document.getElementById('avgAge')
const malePerc = document.getElementById('malePerc')
const femalePerc = document.getElementById('femalePerc')

fetch('https://rehaanengage2022.herokuapp.com/data/analytics/getData', {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then(response => response.json())
      .then(json => {
          console.log(json)
          avgAge.innerHTML = json.avgAge
          malePerc.innerHTML = json.malePercent+"%"
          femalePerc.innerHTML = json.femalePercent+"%"
      })
      .catch(err => console.log('RequestFailed', err))