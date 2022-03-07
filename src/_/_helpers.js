export const getProductId = () => {
    
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id') ? urlParams.get('id') : "";
    return id;
}

export const getProductIdFromLink = () => {
    
    let url = new URL(window.location.href);
    let id = url.pathname.trim().split('/').slice(-2)[0];
    return id;
}

export const replaceQueryParam = (param, newval, search) => {

    let regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    let query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

export const getPageNumberOld = () => {

    let url = window.location.href.split('/');
    let page = url[url.length-1];
    let pageN = 1;
    if(page.indexOf('page')==0){
      pageN = page.replace('page', '').replace('#', '');
    }
    // console.log(pageN);
    return parseInt(pageN);
}

export const getPageNumber = () => {

    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') ? urlParams.get('page') : 1;

    return parseInt(page);
}

export const getPagination = (meta, cb) => {

    if(typeof(meta) === 'undefined'){ document.querySelector("#listing_info").innerHTML = 'no records to display'; return; }

    let offset = meta.limit+meta.offset;
    if(offset>meta.total_records) offset = meta.total_records;

    document.querySelector("#listing_info").innerHTML = "Showing "+(1+meta.offset)+" to "+(offset)+" of "+meta.total_records+" entries";

    let pbc = Math.ceil(meta.total_records / meta.limit);
    // console.log(pbc);
    document.querySelector("#listing_paginate").style.display = (pbc < 2) ? "none" : "block";

    // page 1 

    // page 3
    // 1 2

    // page 5
    // 2 3 4 .. 

    let page = getPageNumber(); 
    let html = '<ul class="pagination d-flex justify-content-end pagination-flat">';
    html += '<li class="paginate_button page-item previous" id="listing_previous"><a href="#" aria-controls="order-listing" data-type="prev" data-page="0" tabindex="0" class="page-link"><span aria-hidden="true">&laquo;</span></li>';
    let i = 0;
    while(i<pbc){

        i++; 
        if(((i >= page-3) && (i <= page)) || ((i <= page+3) && (i >=page))){

            html += '<li class="paginate_button page-item '+((page==i)?'active':'')+'"><a href="#" aria-controls="order-listing" data-type="page" data-page="'+i+'" tabindex="0" class="page-link">'+(page==i?'..':i)+'</a></li>';      
        }
    }  
    html += '<li class="paginate_button page-item next" id="order-listing_next"><a href="#" aria-controls="order-listing" data-type="next" data-page="2" tabindex="0" class="page-link"><span aria-hidden="true">&raquo;</span></a></li>';
    html += '</ul>'

    document.querySelector("#listing_paginate").innerHTML = html;

    let page_link = document.querySelectorAll(".page-link");
    for (const l of page_link) {
        l.addEventListener('click', function(e) {

            let p = parseInt(getPageNumber());
            let ps = p;
            switch(l.dataset.type){ 
                case 'prev': p-=1; if(p<1) p = 1; break;
                case 'page': p=l.dataset.page; break;
                case 'next': p+=1; if(p>pbc) p = pbc; break;
            }
            
            // update url
            if (window.history.replaceState) {

                // let url = window.location.href.split('/page');
                // let urlF = (url[0]+'/page'+p).replace('//page', '/page');

                let str = window.location.search;
                str = replaceQueryParam('page', p, str);
                // window.location = window.location.pathname + str

                // prevents browser from storing history with each change:
                window.history.replaceState("kenzap-cloud", document.title, window.location.pathname + str);
            }

            // only refresh if page differs
            if(ps!=p) cb();
            
            e.preventDefault();
            return false;
        });
    }
}

export const formatStatus = (st) => {

    st = parseInt(st); 
    switch(st){ 
      case 0: return '<div class="badge bg-warning text-dark fw-light">Draft</div>';
      case 1: return '<div class="badge bg-primary fw-light">Published</div>';
      case 3: return '<div class="badge bg-secondary fw-light">Unpublished</div>';
      default: return '<div class="badge bg-secondary fw-light">Drafts</div>';
    }
}

export const formatPrice = (price) => {

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: "USD", });
    if(typeof(price) === 'undefined' || price == '') price = 0;
    price = parseFloat(price);
    price = formatter.format(price);
    return price;
}

export const formatTime = (timestamp) => {
	
    let a = new Date(timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// nums only validation
export const numsOnly = (e, max) => {

    // Only ASCII charactar in that range allowed 
    var ASCIICode = (e.which) ? e.which : e.keyCode 
    if (ASCIICode > 31 && ASCIICode != 46 && (ASCIICode < 48 || ASCIICode > 57)) 
    return false; 

    if(parseFloat(e.target.value)>max) 
    return false; 

    let dec = e.target.value.split('.');
    if(dec.length>1)
    if(dec[1].length>1)
        return false;
    
    return true; 
}

export const onClick = (sel, fn) => {

    // console.log('onClick');
    if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

        e.removeEventListener('click', fn, true);
        e.addEventListener('click', fn, true);
    }
}

// time elapsed since creation 
export const timeConverterAgo = (now, time) => {

    console.log(now + " " + time);

    now = parseInt(now);
    time = parseInt(time);

    console.log(now + " " + time);

    // parse as elapsed time
    let past = now - time;
    if(past < 60) return 'moments ago';
    if(past < 3600) return parseInt(past / 60) + ' minutes ago';
    if(past < 86400) return parseInt(past / 60 / 24) + ' hours ago';

    // process as normal date
    var a = new Date(time * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

export const getCurrencies = () => {

    // length 164
    return [
        {"name":"Afghan Afghani","code":"AFA","symbol":"؋"},
        {"name":"Albanian Lek","code":"ALL","symbol":"Lek"},
        {"name":"Algerian Dinar","code":"DZD","symbol":"دج"},
        {"name":"Angolan Kwanza","code":"AOA","symbol":"Kz"},
        {"name":"Argentine Peso","code":"ARS","symbol":"$"},
        {"name":"Armenian Dram","code":"AMD","symbol":"֏"},
        {"name":"Aruban Florin","code":"AWG","symbol":"ƒ"},
        {"name":"Australian Dollar","code":"AUD","symbol":"$"},
        {"name":"Azerbaijani Manat","code":"AZN","symbol":"m"},
        {"name":"Bahamian Dollar","code":"BSD","symbol":"B$"},
        {"name":"Bahraini Dinar","code":"BHD","symbol":".د.ب"},
        {"name":"Bangladeshi Taka","code":"BDT","symbol":"৳"},
        {"name":"Barbadian Dollar","code":"BBD","symbol":"Bds$"},
        {"name":"Belarusian Ruble","code":"BYR","symbol":"Br"},
        {"name":"Belgian Franc","code":"BEF","symbol":"fr"},
        {"name":"Belize Dollar","code":"BZD","symbol":"$"},
        {"name":"Bermudan Dollar","code":"BMD","symbol":"$"},
        {"name":"Bhutanese Ngultrum","code":"BTN","symbol":"Nu."},
        {"name":"Bitcoin","code":"BTC","symbol":"฿"},
        {"name":"Bolivian Boliviano","code":"BOB","symbol":"Bs."},
        {"name":"Bosnia-Herzegovina Convertible Mark","code":"BAM","symbol":"KM"},
        {"name":"Botswanan Pula","code":"BWP","symbol":"P"},
        {"name":"Brazilian Real","code":"BRL","symbol":"R$"},
        {"name":"British Pound Sterling","code":"GBP","symbol":"£"},
        {"name":"Brunei Dollar","code":"BND","symbol":"B$"},
        {"name":"Bulgarian Lev","code":"BGN","symbol":"Лв."},
        {"name":"Burundian Franc","code":"BIF","symbol":"FBu"},
        {"name":"Cambodian Riel","code":"KHR","symbol":"KHR"},
        {"name":"Canadian Dollar","code":"CAD","symbol":"$"},
        {"name":"Cape Verdean Escudo","code":"CVE","symbol":"$"},
        {"name":"Cayman Islands Dollar","code":"KYD","symbol":"$"},
        {"name":"CFA Franc BCEAO","code":"XOF","symbol":"CFA"},
        {"name":"CFA Franc BEAC","code":"XAF","symbol":"FCFA"},
        {"name":"CFP Franc","code":"XPF","symbol":"₣"},
        {"name":"Chilean Peso","code":"CLP","symbol":"$"},
        {"name":"Chinese Yuan","code":"CNY","symbol":"¥"},
        {"name":"Colombian Peso","code":"COP","symbol":"$"},
        {"name":"Comorian Franc","code":"KMF","symbol":"CF"},
        {"name":"Congolese Franc","code":"CDF","symbol":"FC"},
        {"name":"Costa Rican Colón","code":"CRC","symbol":"₡"},
        {"name":"Croatian Kuna","code":"HRK","symbol":"kn"},
        {"name":"Cuban Convertible Peso","code":"CUC","symbol":"$, CUC"},
        {"name":"Czech Republic Koruna","code":"CZK","symbol":"Kč"},
        {"name":"Danish Krone","code":"DKK","symbol":"Kr."},
        {"name":"Djiboutian Franc","code":"DJF","symbol":"Fdj"},
        {"name":"Dominican Peso","code":"DOP","symbol":"$"},
        {"name":"East Caribbean Dollar","code":"XCD","symbol":"$"},
        {"name":"Egyptian Pound","code":"EGP","symbol":"ج.م"},
        {"name":"Eritrean Nakfa","code":"ERN","symbol":"Nfk"},
        {"name":"Estonian Kroon","code":"EEK","symbol":"kr"},
        {"name":"Ethiopian Birr","code":"ETB","symbol":"Nkf"},
        {"name":"Euro","code":"EUR","symbol":"€"},
        {"name":"Falkland Islands Pound","code":"FKP","symbol":"£"},
        {"name":"Fijian Dollar","code":"FJD","symbol":"FJ$"},
        {"name":"Gambian Dalasi","code":"GMD","symbol":"D"},
        {"name":"Georgian Lari","code":"GEL","symbol":"ლ"},
        {"name":"German Mark","code":"DEM","symbol":"DM"},
        {"name":"Ghanaian Cedi","code":"GHS","symbol":"GH₵"},
        {"name":"Gibraltar Pound","code":"GIP","symbol":"£"},
        {"name":"Greek Drachma","code":"GRD","symbol":"₯, Δρχ, Δρ"},
        {"name":"Guatemalan Quetzal","code":"GTQ","symbol":"Q"},
        {"name":"Guinean Franc","code":"GNF","symbol":"FG"},
        {"name":"Guyanaese Dollar","code":"GYD","symbol":"$"},
        {"name":"Haitian Gourde","code":"HTG","symbol":"G"},
        {"name":"Honduran Lempira","code":"HNL","symbol":"L"},
        {"name":"Hong Kong Dollar","code":"HKD","symbol":"$"},
        {"name":"Hungarian Forint","code":"HUF","symbol":"Ft"},
        {"name":"Icelandic króna","code":"ISK","symbol":"kr"},
        {"name":"Indian Rupee","code":"INR","symbol":"₹"},
        {"name":"Indonesian Rupiah","code":"IDR","symbol":"Rp"},
        {"name":"Iranian Rial","code":"IRR","symbol":"﷼"},
        {"name":"Iraqi Dinar","code":"IQD","symbol":"د.ع"},
        {"name":"Israeli New Sheqel","code":"ILS","symbol":"₪"},
        {"name":"Italian Lira","code":"ITL","symbol":"L,£"},
        {"name":"Jamaican Dollar","code":"JMD","symbol":"J$"},
        {"name":"Japanese Yen","code":"JPY","symbol":"¥"},
        {"name":"Jordanian Dinar","code":"JOD","symbol":"ا.د"},
        {"name":"Kazakhstani Tenge","code":"KZT","symbol":"лв"},
        {"name":"Kenyan Shilling","code":"KES","symbol":"KSh"},
        {"name":"Kuwaiti Dinar","code":"KWD","symbol":"ك.د"},
        {"name":"Kyrgystani Som","code":"KGS","symbol":"лв"},
        {"name":"Laotian Kip","code":"LAK","symbol":"₭"},
        {"name":"Latvian Lats","code":"LVL","symbol":"Ls"},
        {"name":"Lebanese Pound","code":"LBP","symbol":"£"},
        {"name":"Lesotho Loti","code":"LSL","symbol":"L"},
        {"name":"Liberian Dollar","code":"LRD","symbol":"$"},
        {"name":"Libyan Dinar","code":"LYD","symbol":"د.ل"},
        {"name":"Lithuanian Litas","code":"LTL","symbol":"Lt"},
        {"name":"Macanese Pataca","code":"MOP","symbol":"$"},
        {"name":"Macedonian Denar","code":"MKD","symbol":"ден"},
        {"name":"Malagasy Ariary","code":"MGA","symbol":"Ar"},
        {"name":"Malawian Kwacha","code":"MWK","symbol":"MK"},
        {"name":"Malaysian Ringgit","code":"MYR","symbol":"RM"},
        {"name":"Maldivian Rufiyaa","code":"MVR","symbol":"Rf"},
        {"name":"Mauritanian Ouguiya","code":"MRO","symbol":"MRU"},
        {"name":"Mauritian Rupee","code":"MUR","symbol":"₨"},
        {"name":"Mexican Peso","code":"MXN","symbol":"$"},
        {"name":"Moldovan Leu","code":"MDL","symbol":"L"},
        {"name":"Mongolian Tugrik","code":"MNT","symbol":"₮"},
        {"name":"Moroccan Dirham","code":"MAD","symbol":"MAD"},
        {"name":"Mozambican Metical","code":"MZM","symbol":"MT"},
        {"name":"Myanmar Kyat","code":"MMK","symbol":"K"},
        {"name":"Namibian Dollar","code":"NAD","symbol":"$"},
        {"name":"Nepalese Rupee","code":"NPR","symbol":"₨"},
        {"name":"Netherlands Antillean Guilder","code":"ANG","symbol":"ƒ"},
        {"name":"New Taiwan Dollar","code":"TWD","symbol":"$"},
        {"name":"New Zealand Dollar","code":"NZD","symbol":"$"},
        {"name":"Nicaraguan Córdoba","code":"NIO","symbol":"C$"},
        {"name":"Nigerian Naira","code":"NGN","symbol":"₦"},
        {"name":"North Korean Won","code":"KPW","symbol":"₩"},
        {"name":"Norwegian Krone","code":"NOK","symbol":"kr"},
        {"name":"Omani Rial","code":"OMR","symbol":".ع.ر"},
        {"name":"Pakistani Rupee","code":"PKR","symbol":"₨"},
        {"name":"Panamanian Balboa","code":"PAB","symbol":"B/."},
        {"name":"Papua New Guinean Kina","code":"PGK","symbol":"K"},
        {"name":"Paraguayan Guarani","code":"PYG","symbol":"₲"},
        {"name":"Peruvian Nuevo Sol","code":"PEN","symbol":"S/."},
        {"name":"Philippine Peso","code":"PHP","symbol":"₱"},
        {"name":"Polish Zloty","code":"PLN","symbol":"zł"},
        {"name":"Qatari Rial","code":"QAR","symbol":"ق.ر"},
        {"name":"Romanian Leu","code":"RON","symbol":"lei"},
        {"name":"Russian Ruble","code":"RUB","symbol":"₽"},
        {"name":"Rwandan Franc","code":"RWF","symbol":"FRw"},
        {"name":"Salvadoran Colón","code":"SVC","symbol":"₡"},
        {"name":"Samoan Tala","code":"WST","symbol":"SAT"},
        {"name":"Saudi Riyal","code":"SAR","symbol":"﷼"},
        {"name":"Serbian Dinar","code":"RSD","symbol":"din"},
        {"name":"Seychellois Rupee","code":"SCR","symbol":"SRe"},
        {"name":"Sierra Leonean Leone","code":"SLL","symbol":"Le"},
        {"name":"Singapore Dollar","code":"SGD","symbol":"$"},
        {"name":"Slovak Koruna","code":"SKK","symbol":"Sk"},
        {"name":"Solomon Islands Dollar","code":"SBD","symbol":"Si$"},
        {"name":"Somali Shilling","code":"SOS","symbol":"Sh.so."},
        {"name":"South African Rand","code":"ZAR","symbol":"R"},
        {"name":"South Korean Won","code":"KRW","symbol":"₩"},
        {"name":"Special Drawing Rights","code":"XDR","symbol":"SDR"},
        {"name":"Sri Lankan Rupee","code":"LKR","symbol":"Rs"},
        {"name":"St. Helena Pound","code":"SHP","symbol":"£"},
        {"name":"Sudanese Pound","code":"SDG","symbol":".س.ج"},
        {"name":"Surinamese Dollar","code":"SRD","symbol":"$"},
        {"name":"Swazi Lilangeni","code":"SZL","symbol":"E"},
        {"name":"Swedish Krona","code":"SEK","symbol":"kr"},
        {"name":"Swiss Franc","code":"CHF","symbol":"CHf"},
        {"name":"Syrian Pound","code":"SYP","symbol":"LS"},
        {"name":"São Tomé and Príncipe Dobra","code":"STD","symbol":"Db"},
        {"name":"Tajikistani Somoni","code":"TJS","symbol":"SM"},
        {"name":"Tanzanian Shilling","code":"TZS","symbol":"TSh"},
        {"name":"Thai Baht","code":"THB","symbol":"฿"},
        {"name":"Tongan Pa'anga","code":"TOP","symbol":"$"},
        {"name":"Trinidad & Tobago Dollar","code":"TTD","symbol":"$"},
        {"name":"Tunisian Dinar","code":"TND","symbol":"ت.د"},
        {"name":"Turkish Lira","code":"TRY","symbol":"₺"},
        {"name":"Turkmenistani Manat","code":"TMT","symbol":"T"},
        {"name":"Ugandan Shilling","code":"UGX","symbol":"USh"},
        {"name":"Ukrainian Hryvnia","code":"UAH","symbol":"₴"},
        {"name":"United Arab Emirates Dirham","code":"AED","symbol":"إ.د"},
        {"name":"Uruguayan Peso","code":"UYU","symbol":"$"},
        {"name":"US Dollar","code":"USD","symbol":"$"},
        {"name":"Uzbekistan Som","code":"UZS","symbol":"лв"},
        {"name":"Vanuatu Vatu","code":"VUV","symbol":"VT"},
        {"name":"Venezuelan  Bolívar","code":"VEF","symbol":"Bs"},
        {"name":"Vietnamese Dong","code":"VND","symbol":"₫"},
        {"name":"Yemeni Rial","code":"YER","symbol":"﷼"},
        {"name":"Zambian Kwacha","code":"ZMK","symbol":"ZK"}
    ];

    // return {
    //     "AFA": {"name":"Afghan Afghani","symbol":"؋"},
    //     "ALL": {"name":"Albanian Lek","symbol":"Lek"},
    //     "DZD": {"name":"Algerian Dinar","symbol":"دج"},
    //     "AOA": {"name":"Angolan Kwanza","symbol":"Kz"},
    //     "ARS": {"name":"Argentine Peso","symbol":"$"},
    //     "AMD": {"name":"Armenian Dram","symbol":"֏"},
    //     "AWG": {"name":"Aruban Florin","symbol":"ƒ"},
    //     "AUD": {"name":"Australian Dollar","symbol":"$"},
    //     "AZN": {"name":"Azerbaijani Manat","symbol":"m"},
    //     "BSD": {"name":"Bahamian Dollar","symbol":"B$"},
    //     "BHD": {"name":"Bahraini Dinar","symbol":".د.ب"},
    //     "BDT": {"name":"Bangladeshi Taka","symbol":"৳"},
    //     "BBD": {"name":"Barbadian Dollar","symbol":"Bds$"},
    //     "BYR": {"name":"Belarusian Ruble","symbol":"Br"},
    //     "BEF": {"name":"Belgian Franc","symbol":"fr"},
    //     "BZD": {"name":"Belize Dollar","symbol":"$"},
    //     "BMD": {"name":"Bermudan Dollar","symbol":"$"},
    //     "BTN": {"name":"Bhutanese Ngultrum","symbol":"Nu."},
    //     "BTC": {"name":"Bitcoin","symbol":"฿"},
    //     "BOB": {"name":"Bolivian Boliviano","symbol":"Bs."},
    //     "BAM": {"name":"Bosnia-Herzegovina Convertible Mark","symbol":"KM"},
    //     "BWP": {"name":"Botswanan Pula","symbol":"P"},
    //     "BRL": {"name":"Brazilian Real","symbol":"R$"},
    //     "GBP": {"name":"British Pound Sterling","symbol":"£"},
    //     "BND": {"name":"Brunei Dollar","symbol":"B$"},
    //     "BGN": {"name":"Bulgarian Lev","symbol":"Лв."},
    //     "BIF": {"name":"Burundian Franc","symbol":"FBu"},
    //     "KHR": {"name":"Cambodian Riel","symbol":"KHR"},
    //     "CAD": {"name":"Canadian Dollar","symbol":"$"},
    //     "CVE": {"name":"Cape Verdean Escudo","symbol":"$"},
    //     "KYD": {"name":"Cayman Islands Dollar","symbol":"$"},
    //     "XOF": {"name":"CFA Franc BCEAO","symbol":"CFA"},
    //     "XAF": {"name":"CFA Franc BEAC","symbol":"FCFA"},
    //     "XPF": {"name":"CFP Franc","symbol":"₣"},
    //     "CLP": {"name":"Chilean Peso","symbol":"$"},
    //     "CNY": {"name":"Chinese Yuan","symbol":"¥"},
    //     "COP": {"name":"Colombian Peso","symbol":"$"},
    //     "KMF": {"name":"Comorian Franc","symbol":"CF"},
    //     "CDF": {"name":"Congolese Franc","symbol":"FC"},
    //     "CRC": {"name":"Costa Rican ColÃ³n","symbol":"₡"},
    //     "HRK": {"name":"Croatian Kuna","symbol":"kn"},
    //     "CUC": {"name":"Cuban Convertible Peso","symbol":"$, CUC"},
    //     "CZK": {"name":"Czech Republic Koruna","symbol":"Kč"},
    //     "DKK": {"name":"Danish Krone","symbol":"Kr."},
    //     "DJF": {"name":"Djiboutian Franc","symbol":"Fdj"},
    //     "DOP": {"name":"Dominican Peso","symbol":"$"},
    //     "XCD": {"name":"East Caribbean Dollar","symbol":"$"},
    //     "EGP": {"name":"Egyptian Pound","symbol":"ج.م"},
    //     "ERN": {"name":"Eritrean Nakfa","symbol":"Nfk"},
    //     "EEK": {"name":"Estonian Kroon","symbol":"kr"},
    //     "ETB": {"name":"Ethiopian Birr","symbol":"Nkf"},
    //     "EUR": {"name":"Euro","symbol":"€"},
    //     "FKP": {"name":"Falkland Islands Pound","symbol":"£"},
    //     "FJD": {"name":"Fijian Dollar","symbol":"FJ$"},
    //     "GMD": {"name":"Gambian Dalasi","symbol":"D"},
    //     "GEL": {"name":"Georgian Lari","symbol":"ლ"},
    //     "DEM": {"name":"German Mark","symbol":"DM"},
    //     "GHS": {"name":"Ghanaian Cedi","symbol":"GH₵"},
    //     "GIP": {"name":"Gibraltar Pound","symbol":"£"},
    //     "GRD": {"name":"Greek Drachma","symbol":"₯, Δρχ, Δρ"},
    //     "GTQ": {"name":"Guatemalan Quetzal","symbol":"Q"},
    //     "GNF": {"name":"Guinean Franc","symbol":"FG"},
    //     "GYD": {"name":"Guyanaese Dollar","symbol":"$"},
    //     "HTG": {"name":"Haitian Gourde","symbol":"G"},
    //     "HNL": {"name":"Honduran Lempira","symbol":"L"},
    //     "HKD": {"name":"Hong Kong Dollar","symbol":"$"},
    //     "HUF": {"name":"Hungarian Forint","symbol":"Ft"},
    //     "ISK": {"name":"Icelandic KrÃ³na","symbol":"kr"},
    //     "INR": {"name":"Indian Rupee","symbol":"₹"},
    //     "IDR": {"name":"Indonesian Rupiah","symbol":"Rp"},
    //     "IRR": {"name":"Iranian Rial","symbol":"﷼"},
    //     "IQD": {"name":"Iraqi Dinar","symbol":"د.ع"},
    //     "ILS": {"name":"Israeli New Sheqel","symbol":"₪"},
    //     "ITL": {"name":"Italian Lira","symbol":"L,£"},
    //     "JMD": {"name":"Jamaican Dollar","symbol":"J$"},
    //     "JPY": {"name":"Japanese Yen","symbol":"¥"},
    //     "JOD": {"name":"Jordanian Dinar","symbol":"ا.د"},
    //     "KZT": {"name":"Kazakhstani Tenge","symbol":"лв"},
    //     "KES": {"name":"Kenyan Shilling","symbol":"KSh"},
    //     "KWD": {"name":"Kuwaiti Dinar","symbol":"ك.د"},
    //     "KGS": {"name":"Kyrgystani Som","symbol":"лв"},
    //     "LAK": {"name":"Laotian Kip","symbol":"₭"},
    //     "LVL": {"name":"Latvian Lats","symbol":"Ls"},
    //     "LBP": {"name":"Lebanese Pound","symbol":"£"},
    //     "LSL": {"name":"Lesotho Loti","symbol":"L"},
    //     "LRD": {"name":"Liberian Dollar","symbol":"$"},
    //     "LYD": {"name":"Libyan Dinar","symbol":"د.ل"},
    //     "LTL": {"name":"Lithuanian Litas","symbol":"Lt"},
    //     "MOP": {"name":"Macanese Pataca","symbol":"$"},
    //     "MKD": {"name":"Macedonian Denar","symbol":"ден"},
    //     "MGA": {"name":"Malagasy Ariary","symbol":"Ar"},
    //     "MWK": {"name":"Malawian Kwacha","symbol":"MK"},
    //     "MYR": {"name":"Malaysian Ringgit","symbol":"RM"},
    //     "MVR": {"name":"Maldivian Rufiyaa","symbol":"Rf"},
    //     "MRO": {"name":"Mauritanian Ouguiya","symbol":"MRU"},
    //     "MUR": {"name":"Mauritian Rupee","symbol":"₨"},
    //     "MXN": {"name":"Mexican Peso","symbol":"$"},
    //     "MDL": {"name":"Moldovan Leu","symbol":"L"},
    //     "MNT": {"name":"Mongolian Tugrik","symbol":"₮"},
    //     "MAD": {"name":"Moroccan Dirham","symbol":"MAD"},
    //     "MZM": {"name":"Mozambican Metical","symbol":"MT"},
    //     "MMK": {"name":"Myanmar Kyat","symbol":"K"},
    //     "NAD": {"name":"Namibian Dollar","symbol":"$"},
    //     "NPR": {"name":"Nepalese Rupee","symbol":"₨"},
    //     "ANG": {"name":"Netherlands Antillean Guilder","symbol":"ƒ"},
    //     "TWD": {"name":"New Taiwan Dollar","symbol":"$"},
    //     "NZD": {"name":"New Zealand Dollar","symbol":"$"},
    //     "NIO": {"name":"Nicaraguan CÃ³rdoba","symbol":"C$"},
    //     "NGN": {"name":"Nigerian Naira","symbol":"₦"},
    //     "KPW": {"name":"North Korean Won","symbol":"₩"},
    //     "NOK": {"name":"Norwegian Krone","symbol":"kr"},
    //     "OMR": {"name":"Omani Rial","symbol":".ع.ر"},
    //     "PKR": {"name":"Pakistani Rupee","symbol":"₨"},
    //     "PAB": {"name":"Panamanian Balboa","symbol":"B/."},
    //     "PGK": {"name":"Papua New Guinean Kina","symbol":"K"},
    //     "PYG": {"name":"Paraguayan Guarani","symbol":"₲"},
    //     "PEN": {"name":"Peruvian Nuevo Sol","symbol":"S/."},
    //     "PHP": {"name":"Philippine Peso","symbol":"₱"},
    //     "PLN": {"name":"Polish Zloty","symbol":"zł"},
    //     "QAR": {"name":"Qatari Rial","symbol":"ق.ر"},
    //     "RON": {"name":"Romanian Leu","symbol":"lei"},
    //     "RUB": {"name":"Russian Ruble","symbol":"₽"},
    //     "RWF": {"name":"Rwandan Franc","symbol":"FRw"},
    //     "SVC": {"name":"Salvadoran ColÃ³n","symbol":"₡"},
    //     "WST": {"name":"Samoan Tala","symbol":"SAT"},
    //     "SAR": {"name":"Saudi Riyal","symbol":"﷼"},
    //     "RSD": {"name":"Serbian Dinar","symbol":"din"},
    //     "SCR": {"name":"Seychellois Rupee","symbol":"SRe"},
    //     "SLL": {"name":"Sierra Leonean Leone","symbol":"Le"},
    //     "SGD": {"name":"Singapore Dollar","symbol":"$"},
    //     "SKK": {"name":"Slovak Koruna","symbol":"Sk"},
    //     "SBD": {"name":"Solomon Islands Dollar","symbol":"Si$"},
    //     "SOS": {"name":"Somali Shilling","symbol":"Sh.so."},
    //     "ZAR": {"name":"South African Rand","symbol":"R"},
    //     "KRW": {"name":"South Korean Won","symbol":"₩"},
    //     "XDR": {"name":"Special Drawing Rights","symbol":"SDR"},
    //     "LKR": {"name":"Sri Lankan Rupee","symbol":"Rs"},
    //     "SHP": {"name":"St. Helena Pound","symbol":"£"},
    //     "SDG": {"name":"Sudanese Pound","symbol":".س.ج"},
    //     "SRD": {"name":"Surinamese Dollar","symbol":"$"},
    //     "SZL": {"name":"Swazi Lilangeni","symbol":"E"},
    //     "SEK": {"name":"Swedish Krona","symbol":"kr"},
    //     "CHF": {"name":"Swiss Franc","symbol":"CHf"},
    //     "SYP": {"name":"Syrian Pound","symbol":"LS"},
    //     "STD": {"name":"São Tomé and Príncipe Dobra","symbol":"Db"},
    //     "TJS": {"name":"Tajikistani Somoni","symbol":"SM"},
    //     "TZS": {"name":"Tanzanian Shilling","symbol":"TSh"},
    //     "THB": {"name":"Thai Baht","symbol":"฿"},
    //     "TOP": {"name":"Tongan Pa'anga","symbol":"$"},
    //     "TTD": {"name":"Trinidad & Tobago Dollar","symbol":"$"},
    //     "TND": {"name":"Tunisian Dinar","symbol":"ت.د"},
    //     "TRY": {"name":"Turkish Lira","symbol":"₺"},
    //     "TMT": {"name":"Turkmenistani Manat","symbol":"T"},
    //     "UGX": {"name":"Ugandan Shilling","symbol":"USh"},
    //     "UAH": {"name":"Ukrainian Hryvnia","symbol":"₴"},
    //     "AED": {"name":"United Arab Emirates Dirham","symbol":"إ.د"},
    //     "UYU": {"name":"Uruguayan Peso","symbol":"$"},
    //     "USD": {"name":"US Dollar","symbol":"$"},
    //     "UZS": {"name":"Uzbekistan Som","symbol":"лв"},
    //     "VUV": {"name":"Vanuatu Vatu","symbol":"VT"},
    //     "VEF": {"name":"Venezuelan BolÃvar","symbol":"Bs"},
    //     "VND": {"name":"Vietnamese Dong","symbol":"₫"},
    //     "YER": {"name":"Yemeni Rial","symbol":"﷼"},
    //     "ZMK": {"name":"Zambian Kwacha","symbol":"ZK"}
    // };
}