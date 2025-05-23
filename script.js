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

// Fonction pour formater les nombres selon la locale
const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(number)
}

// Fonction pour obtenir les données de l'API
const getDataFromAPI = async () => {
    try {
        const URL = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${selectedCurrency.value}`
        const response = await fetch(URL)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des taux')
        }
        const result = await response.json()
        fetchedData = [result]
        return result
    } catch (error) {
        console.error('Erreur API:', error)
        loadingScreen.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>Erreur de connexion à l'API</p>
        `
        return null
    }
}

// Fonction pour calculer la conversion
const calculateConversion = (amount, rate) => {
    return parseFloat((amount * rate).toFixed(6))
}

// Fonction principale de conversion
const getConversion = async () => {
    try {
        convertedListTag.innerHTML = ""
        convertedListTag.style.display = 'none'
        loadingScreen.style.display = 'flex'
        loadingScreen.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Chargement des taux...</p>
        `
        
        const conversionVal = parseFloat(conversionAmount.value) || 0
        const result = await getDataFromAPI()
        
        if (!result) return
        
        const rateData = result.conversion_rates
        
        for (const currencyCode in countryList) {
            const rate = rateData[currencyCode]
            const convertedValue = calculateConversion(conversionVal, rate)
            const formattedValue = formatNumber(convertedValue)
            
            convertedListTag.innerHTML += `
                <div class="convertedTag">  
                    <span id="flag">  
                        <img src="https://flagcdn.com/40x30/${countryList[currencyCode].toLowerCase()}.png" alt="${currencyCode} flag">  
                        <p data-code="${currencyCode}">${currencyCode}</p>  
                    </span>  
                    <div class="convertedAmount">${formattedValue}</div>  
                    <div class="conversionData">1 ${selectedCurrency.value} = ${formatNumber(rate)} ${currencyCode}</div>  
                </div>`
        }
    } catch (error) {
        console.error('Erreur de conversion:', error)
        convertedListTag.innerHTML = `
            <div class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Une erreur est survenue lors de la conversion</p>
            </div>
        `
    } finally {
        loadingScreen.style.display = 'none'
        convertedListTag.style.display = 'block'
    }
}

// Fonction pour filtrer les devises converties
const filterConvertedData = async () => {
    try {
        notFound.style.display = 'none'
        convertedListTag.style.display = 'block'
        const searchedVal = convertedFilter.value.toLowerCase()
        
        if (!fetchedData.length) {
            await getDataFromAPI()
        }
        
        const filteredCurrencies = Object.keys(countryList).filter(data => 
            data.toLowerCase().startsWith(searchedVal)
        )
        
        if (filteredCurrencies.length === 0) {
            convertedListTag.innerHTML = ''
            convertedListTag.style.display = 'none'
            notFound.style.display = 'block'
            return
        }
        
        const conversionVal = parseFloat(conversionAmount.value) || 0
        const rateData = fetchedData[0].conversion_rates
        
        convertedListTag.innerHTML = filteredCurrencies.map(data => {
            const rate = rateData[data]
            const convertedValue = calculateConversion(conversionVal, rate)
            const formattedValue = formatNumber(convertedValue)
            
            return `
                <div class="convertedTag">  
                    <span id="flag">  
                        <img src="https://flagcdn.com/40x30/${countryList[data].toLowerCase()}.png" alt="${data} flag">  
                        <p data-code="${data}">${data}</p>  
                    </span>  
                    <div class="convertedAmount">${formattedValue}</div>  
                    <div class="conversionData">1 ${selectedCurrency.value} = ${formatNumber(rate)} ${data}</div>  
                </div>`
        }).join('')
    } catch (error) {
        console.error('Erreur de filtrage:', error)
        notFound.style.display = 'block'
    }
}

// Fonction pour filtrer les pays dans la modal
const filterData = () => {
    notFound.style.display = 'none'
    countriesBox.style.display = 'grid'
    const searchedVal = searchInp.value.toLowerCase()
    
    const filteredCurrencies = Object.keys(countryList).filter(data => 
        data.toLowerCase().startsWith(searchedVal)
    )
    
    if (filteredCurrencies.length === 0) {
        countriesBox.innerHTML = ''
        countriesBox.style.display = 'none'
        notFound.style.display = 'block'
        return
    }
    
    countriesBox.innerHTML = filteredCurrencies.map(data => `
        <div class="countryTag">  
            <img src="https://flagcdn.com/40x30/${countryList[data].toLowerCase()}.png" alt="${data} flag">  
            <p data-code="${data}">${data}</p>  
        </div>`
    ).join('')
}

// Initialisation
const initializeApp = async () => {
    try {
        await getDataFromAPI()
        await getConversion()
        
        // Initialisation de la liste des pays
        countriesBox.innerHTML = Object.entries(countryList).map(([code, country]) => `
            <div class="countryTag">  
                <img src="https://flagcdn.com/40x30/${country.toLowerCase()}.png" alt="${code} flag">  
                <p data-code="${code}">${code}</p>  
            </div>`
        ).join('')
    } catch (error) {
        console.error('Erreur d\'initialisation:', error)
    }
}

// Event Listeners
conversionAmount.addEventListener("input", () => {
    const value = conversionAmount.value
    if (value === "" || value === "0") {
        conversionAmount.value = '1'
    }
    getConversion()
})

searchInp.addEventListener("input", filterData)
convertedFilter.addEventListener("input", () => {
    convertedListTag.innerHTML = ""
    convertedCurrencyBox.classList.add('active')
    if (convertedFilter.value === "") {
        convertedCurrencyBox.classList.remove('active')
    }
    filterConvertedData()
})

countryFlag.addEventListener("click", () => {
    countriesModal.classList.add("active")
    const countryTag = document.querySelector(`[data-code="${selectedCurrency.value}"]`)
    if (countryTag) {
        countryTag.parentElement.classList.add('selected')
    }
})

closeModal.addEventListener("click", () => {
    countriesModal.classList.remove("active")
})

window.addEventListener("click", async (e) => {
    if (e.target.classList.contains("countryTag") || e.target.parentElement.classList.contains("countryTag")) {
        const target = e.target.classList.contains("countryTag") ? e.target : e.target.parentElement
        const currencyCode = target.querySelector('p').innerText
        
        document.querySelectorAll('.countryTag').forEach(tag => tag.classList.remove("selected"))
        target.classList.add('selected')
        
        selectedCurrency.value = currencyCode
        countriesModal.classList.remove("active")
        
        const code = countryList[currencyCode].toLowerCase()
        countryFlag.querySelector('img').setAttribute('src', `https://flagcdn.com/40x30/${code}.png`)
        countryFlag.querySelector('p').innerText = currencyCode
        
        await getConversion()
    }
})

window.onload = () => {
    document.getElementById("loading").style.display = "none"
    initializeApp()
} 