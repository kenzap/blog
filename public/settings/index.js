
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * @name initHeader
   * @description Initiates Kenzap Cloud extension header and related scripts. Verifies user sessions, handles SSO, does cloud space navigation, initializes i18n localization. 
   * @param {object} response
   */
  const initHeader = (response) => {

      // cache header from backend
      if(response.header) localStorage.setItem('header', response.header);
    
      // load header to html if not present
      if(!document.querySelector("#k-script")){
    
          let child = document.createElement('div');
          child.innerHTML = localStorage.getItem('header');
          child = child.firstChild;
          document.body.prepend(child);
    
          // run header scripts
          Function(document.querySelector("#k-script").innerHTML).call('test');
      }
    
      // load locales if present
      if(response.locale) window.i18n.init(response.locale); 
  };

  /**
   * @name showLoader
   * @description Initiates full screen three dots loader.
   */
  const showLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'block';
  };

  /**
   * @name hideLoader
   * @description Removes full screen three dots loader.
   */
  const hideLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'none';
  };

  /**
   * @name initFooter
   * @description Removes full screen three dots loader.
   * @param {string} left - Text or html code to be present on the left bottom side of screen
   * @param {string} right - Text or html code to be present on the left bottom side of screen
   */
  const initFooter = (left, right) => {

      document.querySelector("footer .row").innerHTML = `
    <div class="d-sm-flex justify-content-center justify-content-sm-between">
        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${left}</span>
        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${right}</span>
    </div>`;
  };

  /**
   * @name link
   * @description Handles Cloud navigation links between extensions and its pages. Takes care of custom url parameters.
   * @param {string} slug - Any inbound link
   * 
   * @returns {string} link - Returns original link with kenzp cloud space ID identifier.
   */
  const link = (slug) => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let sid = urlParams.get('sid') ? urlParams.get('sid') : "";

      let postfix = slug.indexOf('?') == -1 ? '?sid='+sid : '&sid='+sid;

      return slug + postfix;
  };

  /**
   * @name getSiteId
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
  const getSiteId = () => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('sid') ? urlParams.get('sid') : "";

      return id;
  };

  /**
   * @name getCookie
   * @description Read cookie by its name.
   * @param {string} cname - Cookie name.
   * 
   * @returns {string} value - Cookie value.
   */
  const getCookie = (cname) => {

      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  };

  /**
   * @name parseApiError
   * @description Set default logics for different API Error responses.
   * @param {object} object - API response.
   */
  const parseApiError = (data) => {
   
      switch(data.code){

          // unauthorized
          case 401:

              // dev mode
              if(window.location.href.indexOf('localhost')){ 

                  alert(data.reason); 
                  return; 
              }

              // production mode
              location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href; break;
          
          // something else
          default:

              alert(data.reason); 
              break;
      }
  };

  /**
   * @name initBreadcrumbs
   * @description Render ui breadcrumbs.
   * @param {array} data - List of link objects containing link text and url. If url is missing then renders breadcrumb as static text. Requires html holder with .bc class.
   */
  const initBreadcrumbs = (data) => {

      let html = '<ol class="breadcrumb mt-2 mb-0">';
      for(let bc of data){
          
          if(typeof(bc.link) === 'undefined'){

              html += `<li class="breadcrumb-item">${ bc.text }</li>`;
          }else {

              html += `<li class="breadcrumb-item"><a href="${ bc.link }">${ bc.text }</a></li>`;
          }
      }
      html += '</ol>';
      
      document.querySelector(".bc").innerHTML = html;
  };

  /**
   * @name onClick
   * @description One row click event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onClick = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
      }
  };

  /**
   * @name onKeyUp
   * @description One row key up event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onKeyUp = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('keyup', fn, true);
          e.addEventListener('keyup', fn, true);
      }
  };

  var getCurrencies = function getCurrencies() {
    return [{
      "name": "Afghan Afghani",
      "code": "AFA",
      "symbol": "؋"
    }, {
      "name": "Albanian Lek",
      "code": "ALL",
      "symbol": "Lek"
    }, {
      "name": "Algerian Dinar",
      "code": "DZD",
      "symbol": "دج"
    }, {
      "name": "Angolan Kwanza",
      "code": "AOA",
      "symbol": "Kz"
    }, {
      "name": "Argentine Peso",
      "code": "ARS",
      "symbol": "$"
    }, {
      "name": "Armenian Dram",
      "code": "AMD",
      "symbol": "֏"
    }, {
      "name": "Aruban Florin",
      "code": "AWG",
      "symbol": "ƒ"
    }, {
      "name": "Australian Dollar",
      "code": "AUD",
      "symbol": "$"
    }, {
      "name": "Azerbaijani Manat",
      "code": "AZN",
      "symbol": "m"
    }, {
      "name": "Bahamian Dollar",
      "code": "BSD",
      "symbol": "B$"
    }, {
      "name": "Bahraini Dinar",
      "code": "BHD",
      "symbol": ".د.ب"
    }, {
      "name": "Bangladeshi Taka",
      "code": "BDT",
      "symbol": "৳"
    }, {
      "name": "Barbadian Dollar",
      "code": "BBD",
      "symbol": "Bds$"
    }, {
      "name": "Belarusian Ruble",
      "code": "BYR",
      "symbol": "Br"
    }, {
      "name": "Belgian Franc",
      "code": "BEF",
      "symbol": "fr"
    }, {
      "name": "Belize Dollar",
      "code": "BZD",
      "symbol": "$"
    }, {
      "name": "Bermudan Dollar",
      "code": "BMD",
      "symbol": "$"
    }, {
      "name": "Bhutanese Ngultrum",
      "code": "BTN",
      "symbol": "Nu."
    }, {
      "name": "Bitcoin",
      "code": "BTC",
      "symbol": "฿"
    }, {
      "name": "Bolivian Boliviano",
      "code": "BOB",
      "symbol": "Bs."
    }, {
      "name": "Bosnia-Herzegovina Convertible Mark",
      "code": "BAM",
      "symbol": "KM"
    }, {
      "name": "Botswanan Pula",
      "code": "BWP",
      "symbol": "P"
    }, {
      "name": "Brazilian Real",
      "code": "BRL",
      "symbol": "R$"
    }, {
      "name": "British Pound Sterling",
      "code": "GBP",
      "symbol": "£"
    }, {
      "name": "Brunei Dollar",
      "code": "BND",
      "symbol": "B$"
    }, {
      "name": "Bulgarian Lev",
      "code": "BGN",
      "symbol": "Лв."
    }, {
      "name": "Burundian Franc",
      "code": "BIF",
      "symbol": "FBu"
    }, {
      "name": "Cambodian Riel",
      "code": "KHR",
      "symbol": "KHR"
    }, {
      "name": "Canadian Dollar",
      "code": "CAD",
      "symbol": "$"
    }, {
      "name": "Cape Verdean Escudo",
      "code": "CVE",
      "symbol": "$"
    }, {
      "name": "Cayman Islands Dollar",
      "code": "KYD",
      "symbol": "$"
    }, {
      "name": "CFA Franc BCEAO",
      "code": "XOF",
      "symbol": "CFA"
    }, {
      "name": "CFA Franc BEAC",
      "code": "XAF",
      "symbol": "FCFA"
    }, {
      "name": "CFP Franc",
      "code": "XPF",
      "symbol": "₣"
    }, {
      "name": "Chilean Peso",
      "code": "CLP",
      "symbol": "$"
    }, {
      "name": "Chinese Yuan",
      "code": "CNY",
      "symbol": "¥"
    }, {
      "name": "Colombian Peso",
      "code": "COP",
      "symbol": "$"
    }, {
      "name": "Comorian Franc",
      "code": "KMF",
      "symbol": "CF"
    }, {
      "name": "Congolese Franc",
      "code": "CDF",
      "symbol": "FC"
    }, {
      "name": "Costa Rican ColÃ³n",
      "code": "CRC",
      "symbol": "₡"
    }, {
      "name": "Croatian Kuna",
      "code": "HRK",
      "symbol": "kn"
    }, {
      "name": "Cuban Convertible Peso",
      "code": "CUC",
      "symbol": "$, CUC"
    }, {
      "name": "Czech Republic Koruna",
      "code": "CZK",
      "symbol": "Kč"
    }, {
      "name": "Danish Krone",
      "code": "DKK",
      "symbol": "Kr."
    }, {
      "name": "Djiboutian Franc",
      "code": "DJF",
      "symbol": "Fdj"
    }, {
      "name": "Dominican Peso",
      "code": "DOP",
      "symbol": "$"
    }, {
      "name": "East Caribbean Dollar",
      "code": "XCD",
      "symbol": "$"
    }, {
      "name": "Egyptian Pound",
      "code": "EGP",
      "symbol": "ج.م"
    }, {
      "name": "Eritrean Nakfa",
      "code": "ERN",
      "symbol": "Nfk"
    }, {
      "name": "Estonian Kroon",
      "code": "EEK",
      "symbol": "kr"
    }, {
      "name": "Ethiopian Birr",
      "code": "ETB",
      "symbol": "Nkf"
    }, {
      "name": "Euro",
      "code": "EUR",
      "symbol": "€"
    }, {
      "name": "Falkland Islands Pound",
      "code": "FKP",
      "symbol": "£"
    }, {
      "name": "Fijian Dollar",
      "code": "FJD",
      "symbol": "FJ$"
    }, {
      "name": "Gambian Dalasi",
      "code": "GMD",
      "symbol": "D"
    }, {
      "name": "Georgian Lari",
      "code": "GEL",
      "symbol": "ლ"
    }, {
      "name": "German Mark",
      "code": "DEM",
      "symbol": "DM"
    }, {
      "name": "Ghanaian Cedi",
      "code": "GHS",
      "symbol": "GH₵"
    }, {
      "name": "Gibraltar Pound",
      "code": "GIP",
      "symbol": "£"
    }, {
      "name": "Greek Drachma",
      "code": "GRD",
      "symbol": "₯, Δρχ, Δρ"
    }, {
      "name": "Guatemalan Quetzal",
      "code": "GTQ",
      "symbol": "Q"
    }, {
      "name": "Guinean Franc",
      "code": "GNF",
      "symbol": "FG"
    }, {
      "name": "Guyanaese Dollar",
      "code": "GYD",
      "symbol": "$"
    }, {
      "name": "Haitian Gourde",
      "code": "HTG",
      "symbol": "G"
    }, {
      "name": "Honduran Lempira",
      "code": "HNL",
      "symbol": "L"
    }, {
      "name": "Hong Kong Dollar",
      "code": "HKD",
      "symbol": "$"
    }, {
      "name": "Hungarian Forint",
      "code": "HUF",
      "symbol": "Ft"
    }, {
      "name": "Icelandic KrÃ³na",
      "code": "ISK",
      "symbol": "kr"
    }, {
      "name": "Indian Rupee",
      "code": "INR",
      "symbol": "₹"
    }, {
      "name": "Indonesian Rupiah",
      "code": "IDR",
      "symbol": "Rp"
    }, {
      "name": "Iranian Rial",
      "code": "IRR",
      "symbol": "﷼"
    }, {
      "name": "Iraqi Dinar",
      "code": "IQD",
      "symbol": "د.ع"
    }, {
      "name": "Israeli New Sheqel",
      "code": "ILS",
      "symbol": "₪"
    }, {
      "name": "Italian Lira",
      "code": "ITL",
      "symbol": "L,£"
    }, {
      "name": "Jamaican Dollar",
      "code": "JMD",
      "symbol": "J$"
    }, {
      "name": "Japanese Yen",
      "code": "JPY",
      "symbol": "¥"
    }, {
      "name": "Jordanian Dinar",
      "code": "JOD",
      "symbol": "ا.د"
    }, {
      "name": "Kazakhstani Tenge",
      "code": "KZT",
      "symbol": "лв"
    }, {
      "name": "Kenyan Shilling",
      "code": "KES",
      "symbol": "KSh"
    }, {
      "name": "Kuwaiti Dinar",
      "code": "KWD",
      "symbol": "ك.د"
    }, {
      "name": "Kyrgystani Som",
      "code": "KGS",
      "symbol": "лв"
    }, {
      "name": "Laotian Kip",
      "code": "LAK",
      "symbol": "₭"
    }, {
      "name": "Latvian Lats",
      "code": "LVL",
      "symbol": "Ls"
    }, {
      "name": "Lebanese Pound",
      "code": "LBP",
      "symbol": "£"
    }, {
      "name": "Lesotho Loti",
      "code": "LSL",
      "symbol": "L"
    }, {
      "name": "Liberian Dollar",
      "code": "LRD",
      "symbol": "$"
    }, {
      "name": "Libyan Dinar",
      "code": "LYD",
      "symbol": "د.ل"
    }, {
      "name": "Lithuanian Litas",
      "code": "LTL",
      "symbol": "Lt"
    }, {
      "name": "Macanese Pataca",
      "code": "MOP",
      "symbol": "$"
    }, {
      "name": "Macedonian Denar",
      "code": "MKD",
      "symbol": "ден"
    }, {
      "name": "Malagasy Ariary",
      "code": "MGA",
      "symbol": "Ar"
    }, {
      "name": "Malawian Kwacha",
      "code": "MWK",
      "symbol": "MK"
    }, {
      "name": "Malaysian Ringgit",
      "code": "MYR",
      "symbol": "RM"
    }, {
      "name": "Maldivian Rufiyaa",
      "code": "MVR",
      "symbol": "Rf"
    }, {
      "name": "Mauritanian Ouguiya",
      "code": "MRO",
      "symbol": "MRU"
    }, {
      "name": "Mauritian Rupee",
      "code": "MUR",
      "symbol": "₨"
    }, {
      "name": "Mexican Peso",
      "code": "MXN",
      "symbol": "$"
    }, {
      "name": "Moldovan Leu",
      "code": "MDL",
      "symbol": "L"
    }, {
      "name": "Mongolian Tugrik",
      "code": "MNT",
      "symbol": "₮"
    }, {
      "name": "Moroccan Dirham",
      "code": "MAD",
      "symbol": "MAD"
    }, {
      "name": "Mozambican Metical",
      "code": "MZM",
      "symbol": "MT"
    }, {
      "name": "Myanmar Kyat",
      "code": "MMK",
      "symbol": "K"
    }, {
      "name": "Namibian Dollar",
      "code": "NAD",
      "symbol": "$"
    }, {
      "name": "Nepalese Rupee",
      "code": "NPR",
      "symbol": "₨"
    }, {
      "name": "Netherlands Antillean Guilder",
      "code": "ANG",
      "symbol": "ƒ"
    }, {
      "name": "New Taiwan Dollar",
      "code": "TWD",
      "symbol": "$"
    }, {
      "name": "New Zealand Dollar",
      "code": "NZD",
      "symbol": "$"
    }, {
      "name": "Nicaraguan CÃ³rdoba",
      "code": "NIO",
      "symbol": "C$"
    }, {
      "name": "Nigerian Naira",
      "code": "NGN",
      "symbol": "₦"
    }, {
      "name": "North Korean Won",
      "code": "KPW",
      "symbol": "₩"
    }, {
      "name": "Norwegian Krone",
      "code": "NOK",
      "symbol": "kr"
    }, {
      "name": "Omani Rial",
      "code": "OMR",
      "symbol": ".ع.ر"
    }, {
      "name": "Pakistani Rupee",
      "code": "PKR",
      "symbol": "₨"
    }, {
      "name": "Panamanian Balboa",
      "code": "PAB",
      "symbol": "B/."
    }, {
      "name": "Papua New Guinean Kina",
      "code": "PGK",
      "symbol": "K"
    }, {
      "name": "Paraguayan Guarani",
      "code": "PYG",
      "symbol": "₲"
    }, {
      "name": "Peruvian Nuevo Sol",
      "code": "PEN",
      "symbol": "S/."
    }, {
      "name": "Philippine Peso",
      "code": "PHP",
      "symbol": "₱"
    }, {
      "name": "Polish Zloty",
      "code": "PLN",
      "symbol": "zł"
    }, {
      "name": "Qatari Rial",
      "code": "QAR",
      "symbol": "ق.ر"
    }, {
      "name": "Romanian Leu",
      "code": "RON",
      "symbol": "lei"
    }, {
      "name": "Russian Ruble",
      "code": "RUB",
      "symbol": "₽"
    }, {
      "name": "Rwandan Franc",
      "code": "RWF",
      "symbol": "FRw"
    }, {
      "name": "Salvadoran ColÃ³n",
      "code": "SVC",
      "symbol": "₡"
    }, {
      "name": "Samoan Tala",
      "code": "WST",
      "symbol": "SAT"
    }, {
      "name": "Saudi Riyal",
      "code": "SAR",
      "symbol": "﷼"
    }, {
      "name": "Serbian Dinar",
      "code": "RSD",
      "symbol": "din"
    }, {
      "name": "Seychellois Rupee",
      "code": "SCR",
      "symbol": "SRe"
    }, {
      "name": "Sierra Leonean Leone",
      "code": "SLL",
      "symbol": "Le"
    }, {
      "name": "Singapore Dollar",
      "code": "SGD",
      "symbol": "$"
    }, {
      "name": "Slovak Koruna",
      "code": "SKK",
      "symbol": "Sk"
    }, {
      "name": "Solomon Islands Dollar",
      "code": "SBD",
      "symbol": "Si$"
    }, {
      "name": "Somali Shilling",
      "code": "SOS",
      "symbol": "Sh.so."
    }, {
      "name": "South African Rand",
      "code": "ZAR",
      "symbol": "R"
    }, {
      "name": "South Korean Won",
      "code": "KRW",
      "symbol": "₩"
    }, {
      "name": "Special Drawing Rights",
      "code": "XDR",
      "symbol": "SDR"
    }, {
      "name": "Sri Lankan Rupee",
      "code": "LKR",
      "symbol": "Rs"
    }, {
      "name": "St. Helena Pound",
      "code": "SHP",
      "symbol": "£"
    }, {
      "name": "Sudanese Pound",
      "code": "SDG",
      "symbol": ".س.ج"
    }, {
      "name": "Surinamese Dollar",
      "code": "SRD",
      "symbol": "$"
    }, {
      "name": "Swazi Lilangeni",
      "code": "SZL",
      "symbol": "E"
    }, {
      "name": "Swedish Krona",
      "code": "SEK",
      "symbol": "kr"
    }, {
      "name": "Swiss Franc",
      "code": "CHF",
      "symbol": "CHf"
    }, {
      "name": "Syrian Pound",
      "code": "SYP",
      "symbol": "LS"
    }, {
      "name": "São Tomé and Príncipe Dobra",
      "code": "STD",
      "symbol": "Db"
    }, {
      "name": "Tajikistani Somoni",
      "code": "TJS",
      "symbol": "SM"
    }, {
      "name": "Tanzanian Shilling",
      "code": "TZS",
      "symbol": "TSh"
    }, {
      "name": "Thai Baht",
      "code": "THB",
      "symbol": "฿"
    }, {
      "name": "Tongan Pa'anga",
      "code": "TOP",
      "symbol": "$"
    }, {
      "name": "Trinidad & Tobago Dollar",
      "code": "TTD",
      "symbol": "$"
    }, {
      "name": "Tunisian Dinar",
      "code": "TND",
      "symbol": "ت.د"
    }, {
      "name": "Turkish Lira",
      "code": "TRY",
      "symbol": "₺"
    }, {
      "name": "Turkmenistani Manat",
      "code": "TMT",
      "symbol": "T"
    }, {
      "name": "Ugandan Shilling",
      "code": "UGX",
      "symbol": "USh"
    }, {
      "name": "Ukrainian Hryvnia",
      "code": "UAH",
      "symbol": "₴"
    }, {
      "name": "United Arab Emirates Dirham",
      "code": "AED",
      "symbol": "إ.د"
    }, {
      "name": "Uruguayan Peso",
      "code": "UYU",
      "symbol": "$"
    }, {
      "name": "US Dollar",
      "code": "USD",
      "symbol": "$"
    }, {
      "name": "Uzbekistan Som",
      "code": "UZS",
      "symbol": "лв"
    }, {
      "name": "Vanuatu Vatu",
      "code": "VUV",
      "symbol": "VT"
    }, {
      "name": "Venezuelan BolÃvar",
      "code": "VEF",
      "symbol": "Bs"
    }, {
      "name": "Vietnamese Dong",
      "code": "VND",
      "symbol": "₫"
    }, {
      "name": "Yemeni Rial",
      "code": "YER",
      "symbol": "﷼"
    }, {
      "name": "Zambian Kwacha",
      "code": "ZMK",
      "symbol": "ZK"
    }];
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n    <div class=\"container p-edit\">\n        <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n            <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n            <button class=\"btn btn-primary btn-save\" type=\"button\">".concat(__('Save changes'), "</button>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n              <div class=\"card border-white shadow-sm p-sm-3\">\n                <nav class=\"nav tab-content mb-4\" role=\"tablist\">\n                    <div class=\"nav nav-tabs\" id=\"nav-tab\" role=\"tablist\">\n                        <a class=\"nav-link active\" id=\"nav-notifications-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-notifications\" type=\"button\" role=\"tab\" aria-controls=\"nav-notifications\" aria-selected=\"true\" href=\"#\">").concat(__('Notifications'), "</a>\n                        <a class=\"nav-link\" id=\"nav-currency-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-currency\" type=\"button\" role=\"tab\" aria-controls=\"nav-currency\" aria-selected=\"true\" href=\"#\">").concat(__('Currency'), "</a>\n                        <a class=\"nav-link\" id=\"nav-payout-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-payout\" type=\"button\" role=\"tab\" aria-controls=\"nav-payout\" aria-selected=\"true\"  href=\"#\">").concat(__('Payout'), "</a>\n                        <a class=\"nav-link\" id=\"nav-tax-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-tax\" type=\"button\" role=\"tab\" aria-controls=\"nav-tax\" aria-selected=\"true\"  href=\"#\">").concat(__('Tax'), "</a>\n                    </div>\n                </nav>\n                <div class=\"card-body tab-content\" id=\"nav-tabContent\">\n                    <div class=\"tab-pane fade show active\" id=\"nav-notifications\" role=\"tabpanel\" aria-labelledby=\"nav-notifications-link\">\n                    <h4 id=\"gen\" class=\"card-title mb-4\">").concat(__('Notification settings'), "</h4>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('New order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_new_order\" class=\"form-control inp\" name=\"notify_new_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_new_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_new_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Cancelled order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_cancel_order\" class=\"form-control inp\" name=\"notify_cancel_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_cancel_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_cancel_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Processing order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_proc_order\" class=\"form-control inp\" name=\"notify_proc_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_proc_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_proc_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Refunded order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_refunded_order\" class=\"form-control inp\" name=\"notify_refunded_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_refunded_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_refunded_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Refunded order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_completed_order\" class=\"form-control inp\" name=\"notify_completed_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_completed_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_completed_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-currency\" role=\"tabpanel\" aria-labelledby=\"nav-currency-link\">\n                    <h4 id=\"gen\" class=\"card-title mb-4\">").concat(__('Currency settings'), "</h4>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"currency\" class=\"form-control inp\" name=\"currency\" data-type=\"select\">\n                              \n                            \n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency symbol'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"currency_symb\" type=\"text\" class=\"form-control inp\" name=\"currency_symb\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency position'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"currency_symb_loc\" class=\"form-control inp\" name=\"currency_symb_loc\" data-type=\"select\">\n                              <option value=\"left\">").concat(__('Left'), "</option>\n                              <option value=\"right\">").concat(__('Right'), "</option>\n                              <option value=\"left_space\">").concat(__('Left with space'), "</option>\n                              <option value=\"right_space\">").concat(__('Right with space'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-tax\" role=\"tabpanel\" aria-labelledby=\"nav-tax-link\">\n                    <h4 id=\"tax\" class=\"card-title mb-4\">").concat(__('Your tax informatio'), "</h4>\n                    <p class=\"card-description\"> ").concat(__('Invoice info (this information will be not revealed public)'), " </p>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Tax ID'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"vat\" type=\"text\" class=\"form-control inp\" name=\"vat\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Email'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"email\" type=\"email\" class=\"form-control inp\" name=\"email\" data-type=\"email\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Company'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"company\" type=\"text\" class=\"form-control inp inp\" name=\"company\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Type'), "</label>\n                          <div class=\"col-sm-4\">\n                            <div class=\"form-check\">\n                              <label class=\"form-check-label\">\n                                <input type=\"radio\" class=\"form-check-input inp\" name=\"entity_type\" id=\"entity_type\" value=\"individual\" data-type=\"radio\">\n                                ").concat(__('Individual'), "\n                                <i class=\"input-helper\"></i></label>\n                            </div>\n                          </div>\n                          <div class=\"col-sm-5\">\n                            <div class=\"form-check\">\n                              <label class=\"form-check-label\">\n                                <input type=\"radio\" class=\"form-check-input inp\" name=\"entity_type\" id=\"entity_type\" value=\"business\" data-type=\"radio\">\n                                ").concat(__('Business'), "\n                                <i class=\"input-helper\"></i></label>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <p class=\"card-description\">\n                        ").concat(__('Address'), "\n                    </p>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\"> ").concat(__('Address 1'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"addr1\" type=\"text\" class=\"form-control inp\" name=\"addr1\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('State'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"state\" type=\"text\" class=\"form-control inp\" name=\"state\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Address 2'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"addr2\" type=\"text\" class=\"form-control inp\" name=\"addr2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Postcode'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"post\" type=\"text\" class=\"form-control inp\" name=\"post\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('City'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"city\" type=\"text\" class=\"form-control inp\" name=\"city\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Country'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"country\" class=\"form-control inp\" name=\"country\" data-type=\"select\">\n                              <?php include('inc/select-countries.php'); ?>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-payout\" role=\"tabpanel\" aria-labelledby=\"nav-payout-link\">\n                    <h4 id=\"payout\" class=\"card-title mb-4\" title=\"payouts\">").concat(__('Payout data'), "</h4>\n                    <p class=\"card-description\">").concat(__('This information is used to process your earnings as part of Kenzap Affiliate or Kenzap Designing programs.'), "</p>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank account holder\'s name'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y1\" type=\"text\" class=\"form-control inp\" name=\"y1\" minlength=\"2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('IBAN/Account Nr.'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y2\" type=\"text\" class=\"form-control inp\" name=\"y2\" minlength=\"2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('SWIFT Code'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y3\" type=\"text\" class=\"form-control inp\" name=\"y3\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank name'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y4\" type=\"text\" class=\"form-control inp\" name=\"y4\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank branch city'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y5\" type=\"text\" class=\"form-control inp\" name=\"y5\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank branch country'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"y6\" class=\"form-control inp\" name=\"y6\" data-type=\"select\">\n                              <?php include('inc/countries.php'); ?>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    </div>\n\n                </div>\n              </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\" >   \n      <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" data-bs-delay=\"3000\">\n        <div class=\"d-flex\">  \n          <div class=\"toast-body\"></div>\n          <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n        </div>\n      </div>\n    </div>\n    ");
  };

  var _this = {
    state: {
      firstLoad: true,
      limit: 10
    },
    init: function init() {
      _this.getData();
    },
    getData: function getData() {
      if (_this.state.firstLoad) showLoader();
      document.querySelector('.search-cont input') ? document.querySelector('.search-cont input').value : '';
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
          'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
          'Kenzap-Header': localStorage.hasOwnProperty('header'),
          'Kenzap-Token': getCookie('kenzap_token'),
          'Kenzap-Sid': getSiteId()
        },
        body: JSON.stringify({
          query: {
            user: {
              type: 'authenticate',
              fields: ['avatar'],
              token: getCookie('kenzap_token')
            },
            locale: {
              type: 'locale',
              id: getCookie('lang')
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: '*'
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          initHeader(response);

          _this.loadPageStructure();

          _this.renderPage(response);

          _this.initListeners();

          _this.initFooter();

          _this.state.firstLoad = false;
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    authUser: function authUser(response) {
      if (response.user) {
        if (response.user.success == true) ;
      }
    },
    loadPageStructure: function loadPageStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    renderPage: function renderPage(response) {
      if (_this.state.firstLoad) {
        initBreadcrumbs([{
          link: link('https://dashboard.kenzap.cloud'),
          text: __('Dashboard')
        }, {
          link: link('/'),
          text: __('E-commerce')
        }, {
          text: __('Settings')
        }]);
      }

      var coptions = '<option value="">' + __('Choose currency') + '</option>';

      var _iterator = _createForOfIteratorHelper(getCurrencies()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          coptions += "<option value=\"".concat(c.code, "\">").concat(__(c.name), " (").concat(__(c.code), ")</option>");
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      document.querySelector("#currency").innerHTML = coptions;

      for (var field in response.settings) {
        if (typeof response.settings[field] === "undefined") continue;
        if (response.settings[field] == "") continue;
        if (document.querySelector("#" + field)) switch (document.querySelector("#" + field).dataset.type) {
          case 'text':
          case 'email':
          case 'emails':
          case 'select':
          case 'textarea':
            document.querySelector("#" + field).value = response.settings[field];
            break;
        }
      }

      getSiteId();
    },
    initListeners: function initListeners() {
      if (!_this.state.firstLoad) return;
      onClick('.btn-save', _this.saveSettings);
    },
    listeners: {
      removeProduct: function removeProduct(e) {
        e.preventDefault();
        var c = confirm(__('Completely remove this product?'));
        if (!c) return;
        fetch('https://api-v1.kenzap.cloud/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
            'Kenzap-Token': getCookie('kenzap_token'),
            'Kenzap-Sid': getSiteId()
          },
          body: JSON.stringify({
            query: {
              product: {
                type: 'delete',
                key: 'product',
                id: e.currentTarget.dataset.id
              }
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            _this.getData();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      },
      searchProductsActivate: function searchProductsActivate(e) {
        e.preventDefault();
        document.querySelector('.table-p-list thead tr th:nth-child(2) span').style.display = 'none';
        document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont').style.display = 'flex';
        document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont input').focus();
        onKeyUp('.table-p-list thead tr th:nth-child(2) .search-cont input', _this.listeners.searchProducts);
      },
      searchProducts: function searchProducts(e) {
        e.preventDefault();

        _this.getData();
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        console.log('calling modalSuccessBtnFunc');

        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    saveSettings: function saveSettings(e) {
      e.preventDefault();
      var data = {};

      var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll('.form-control')),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var s = _step2.value;

          switch (s.dataset.type) {
            case 'text':
            case 'email':
            case 'emails':
            case 'select':
            case 'textarea':
              data[s.id] = s.value;
              break;

            case 'radio':
              data[s.id] = s.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('input:checked').value;
              break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
          'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
          'Kenzap-Token': getCookie('kenzap_token'),
          'Kenzap-Sid': getSiteId()
        },
        body: JSON.stringify({
          query: {
            settings: {
              type: 'set',
              key: 'ecommerce-settings',
              data: data
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          var _toast = new bootstrap.Toast(document.querySelector('.toast'));

          document.querySelector('.toast .toast-body').innerHTML = __('Successfully updated');

          _toast.show();
        } else {
          parseApiError(response);
        }

        console.log('Success:', response);
      })["catch"](function (error) {
        console.error('Error:', error);
      });
      console.log('saveSettings');
    },
    initFooter: function initFooter$1() {
      initFooter(__('Copyright © ' + new Date().getFullYear() + ' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
