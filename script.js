const searchBox = document.querySelector('.searchBox')
convertedFilter = document.querySelector('#convertedFilter')
countriesBox = document.querySelector('.countriesBox')
notFound = document.querySelector('.notFound')
clearSearch = document.querySelector('.clearSearch')
closeModal = document.querySelector('.closeModal')
countryFlag = document.querySelector('#flag')
countriesModal = document.querySelector('.countriesModal')
selectedCurrency = document.querySelector('#selectedCurrency')
convertedListTag = document.querySelector('.convertedListTag')
conversionAmount = document.querySelector('#conversionAmount')
loadingScreen = document.querySelector('.loadingScreen')
convertedCurrencyBox = document.querySelector('.convertedCurrencyBox')
searchInp = document.querySelector('#searchInp')
APIKey = '60ec6c2270a80ca6c3a356d4'
fetchedData = []
const getDataFromAPI = () => {
    let URL = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${selectedCurrency.value}`
    fetch(URL).then(response => response.json()).then((result) => {
        fetchedData.push(result)
    })
}
const getConversion = () => {
    convertedListTag.innerHTML = ""
    convertedListTag.style.display = 'none'
    loadingScreen.style.display = 'flex'
    let conversionVal = conversionAmount.value
    setTimeout(() => {
        let rateData = fetchedData
        for (currencyCode in countryList) {
            convertedListTag.innerHTML += `<div class="convertedTag">  
      <span id="flag">  
      <img src="https://flagcdn.com/40x30/${countryList[currencyCode].toLocaleLowerCase()}.png" alt="">  
      <p data-code="${currencyCode}">${currencyCode}</p>  
      </span>  
      <div class="convertedAmount">  
      ${((rateData[0].conversion_rates[selectedCurrency.value] / rateData[0].conversion_rates[currencyCode]) * conversionVal).toFixed(2)}  
      </div>  
      <div class="conversionData">1 ${selectedCurrency.value} = ${rateData[0].conversion_rates[currencyCode]} ${currencyCode}</div>  
      </div>`
        }
        loadingScreen.style.display = 'none'
        convertedListTag.style.display = 'block'
    }, 2000)
}
getDataFromAPI()
getConversion()
new Promise((resolve, reject) => {
    for (currencyCode in countryList) {
        countriesBox.innerHTML += `<div class="countryTag">  
    <img src="https://flagcdn.com/40x30/${countryList[currencyCode].toLocaleLowerCase()}.png" alt="">  
    <p data-code="${currencyCode}">${currencyCode}</p>  
    </div>`
    }
    resolve(true)
}).then(() => {
    console.log("done")
})
conversionAmount.addEventListener("keyup", () => {
    let conversionVal = conversionAmount.value
    if (conversionVal == "" || conversionVal == "0") {
        conversionAmount.value = '1'
    }
})
const filterData = () => {
    notFound.style.display = 'none'
    countriesBox.style.display = 'grid'
    let searchedVal = searchInp.value.toLowerCase()
    searchedCurrency = []
    searchedCurrency = Object.keys(countryList).filter(data => {
        return data.toLocaleLowerCase().startsWith(searchedVal)
    }).map(data => {
        countriesBox.innerHTML = ''
        return `<div class="countryTag">  
    <img src="https://flagcdn.com/40x30/${countryList[data].toLocaleLowerCase()}.png" alt="">  
    <p data-code="${data}">${data}</p>  
    </div>`
    }).join('')
    if (searchedCurrency != "") {
        countriesBox.innerHTML += searchedCurrency
    } else {
        countriesBox.innerHTML = ''
        countriesBox.style.display = 'none'
        notFound.style.display = 'block'
    }
}
filterData()
const filterConvertedData = () => {
    notFound.style.display = 'none'
    convertedListTag.style.display = 'block'
    let searchedVal = convertedFilter.value.toLowerCase()
    searchedCurrency = []
    searchedCurrency = Object.keys(countryList).filter(data => {
        return data.toLocaleLowerCase().startsWith(searchedVal);
    }).map(data => {
        convertedListTag.innerHTML = ''
        let conversionVal = conversionAmount.value
        let convertedRates = fetchedData[0].conversion_rates
        return `<div class="convertedTag">  
        <span id="flag">  
        <img src="https://flagcdn.com/40x30/${countryList[data].toLocaleLowerCase()}.png" alt="">  
        <p data-code="${data}">${data}</p>  
        </span>  
        <div class="convertedAmount">  
        ${(convertedRates[data] * conversionVal).toFixed(2)}  
        </div>  
        <div class="conversionData">1 ${selectedCurrency.value} = ${convertedRates[data]} ${data}</div>  
        </div>`;
    }).join('')
    if (searchedCurrency != "") {
        convertedListTag.innerHTML += searchedCurrency
    } else {
        convertedListTag.innerHTML = ''
        convertedListTag.style.display = 'none'
        notFound.style.display = 'block'
    }
}
window.addEventListener("click", (e) => {
    if (e.target.classList.contains("countryTag")) {
        let countryTag = document.querySelectorAll('.countryTag')
        countryTag.forEach(tag => {
            tag.classList.remove("selected")
        })
        e.target.classList.add('selected')
        selectedCurrency.value = e.target.querySelector('p').innerText
        countriesModal.classList.remove("active")
        let currentTag = document.querySelector(`[data-code="${selectedCurrency.value}"]`)
        code = currentTag.getAttribute('data-code')
        countryFlag.querySelector('img').setAttribute('src', `https://flagcdn.com/40x30/${countryList[code].toLocaleLowerCase()}.png`)
        countryFlag.querySelector('p').innerText = selectedCurrency.value
        getConversion()
    } else if (e.target.parentElement.classList.contains("countryTag")) {
        let countryTag = document.querySelectorAll('.countryTag')
        countryTag.forEach(tag => {
            tag.classList.remove("selected")
        })
        e.target.parentElement.classList.add('selected')
        selectedCurrency.value = e.target.parentElement.querySelector('p').innerText
        countriesModal.classList.add("active")
        countriesModal.classList.remove("active")
        let currentTag = document.querySelector(`[data-code="${selectedCurrency.value}"]`)
        code = currentTag.getAttribute('data-code')
        countryFlag.querySelector('img').setAttribute('src', `https://flagcdn.com/40x30/${countryList[code].toLocaleLowerCase()}.png`)
        countryFlag.querySelector('p').innerText = selectedCurrency.value
        getConversion()
    }
})
countryFlag.addEventListener("click", () => {
    countriesModal.classList.add("active")
    let countryTag = document.querySelectorAll(`[data-code="${selectedCurrency.value}"]`)
    countryTag[0].parentElement.classList.add('selected')
})
closeModal.addEventListener("click", () => {
    countriesModal.classList.remove("active")
})
convertedFilter.addEventListener("keyup", () => {
    convertedListTag.innerHTML = ""
    convertedCurrencyBox.classList.add('active')
    if (convertedFilter.value == "") {
        convertedCurrencyBox.classList.remove('active')
    }
    filterConvertedData()
})
window.onload = () => {
    document.getElementById("loading").style.display = "none"
} 