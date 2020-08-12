class Currency {

    chooseCurrency(currency) {
        if (currency === 'dollar')
            localStorage.setItem('currency', JSON.stringify(['$', 1]))
        else {
            localStorage.setItem('currency', JSON.stringify(['€', 1.17]))
        }
    }

    convertCurrency(number, delivery = 0){
        let currency = JSON.parse(localStorage.getItem('currency'))
            return(
                currency[0] + Math.round((number + delivery) / currency[1] * 100) / 100
            )
    }

}


export default new Currency();