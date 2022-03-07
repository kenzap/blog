
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
   * @name onChange
   * @description One row change event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onChange = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('change', fn, true);
          e.addEventListener('change', fn, true);
      }
  };

  /**
   * @name simulateClick
   * @description Trigger on click event without user interaction.
   * @param {string} elem - HTML selector, id, class, etc.
   */
   const simulateClick = (elem) => {

  	// create our event (with options)
  	let evt = new MouseEvent('click', {
  		bubbles: true,
  		cancelable: true,
  		view: window
  	});

  	// if cancelled, don't dispatch the event
  	!elem.dispatchEvent(evt);
  };

  var getProductId = function getProductId() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id') ? urlParams.get('id') : "";
    return id;
  };
  var formatPrice = function formatPrice(price) {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: "USD"
    });
    if (typeof price === 'undefined' || price == '') price = 0;
    price = parseFloat(price);
    price = formatter.format(price);
    return price;
  };

  var simpleTags = function simpleTags(element) {
    if (!element) {
      throw new Error("DOM Element is undifined! Please choose HTML target element.");
    }

    var DOMParent = element;
    var DOMList;
    var DOMInput;
    var dataAttribute;
    var arrayOfList;

    function DOMCreate() {
      var ul = document.createElement("ul");
      var input = document.createElement("input");
      input.setAttribute('placeholder', 'new category');
      DOMParent.appendChild(ul);
      DOMParent.appendChild(input);
      DOMList = DOMParent.firstElementChild;
      DOMInput = DOMParent.lastElementChild;
    }

    function DOMRender() {
      DOMList.innerHTML = "";
      arrayOfList.forEach(function (currentValue, index) {
        if (currentValue) {
          var li = document.createElement("li");
          li.innerHTML = "".concat(currentValue, " <a>&times;</a>");
          li.querySelector("a").addEventListener("click", function () {
            onDelete(index);
          });
          DOMList.appendChild(li);
        }
      });
      setAttribute();
    }

    function onKeyUp() {
      DOMInput.addEventListener("keyup", function (event) {
        var text = this.value.trim();

        if (text.includes(",") || event.keyCode === 13) {
          if (text.replace(",", "") !== "") {
            arrayOfList.push(text.replace(",", ""));
          }

          this.value = "";
        }

        DOMRender();
      });
    }

    function onDelete(id) {
      arrayOfList = arrayOfList.filter(function (currentValue, index) {
        if (index === id) {
          return false;
        }

        return currentValue;
      });
      DOMRender();
    }

    function getAttribute() {
      dataAttribute = DOMParent.getAttribute("data-simple-tags");
      dataAttribute = dataAttribute.split(",");
      arrayOfList = dataAttribute.map(function (currentValue) {
        return currentValue.trim();
      });
    }

    function setAttribute() {
      DOMParent.setAttribute("data-simple-tags", arrayOfList.toString());
    }

    getAttribute();
    DOMCreate();
    DOMRender();
    onKeyUp();
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n  <div class=\"container p-edit\">\n    <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n        <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n        \n    </div>\n    <div class=\"row\">\n        <div class=\"col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n            <div class=\"sections\" id=\"sections\" role=\"tablist\" style=\"width:100%;\">\n\n                <div class=\"row\">\n                    <div class=\"col-12 grid-margin stretch-card\">\n                        <div class=\"card border-white shadow-sm p-sm-3\">\n                            <div class=\"card-body\">\n\n                                <div class=\"landing_status\"></div>\n                                <input type=\"hidden\" class=\"form-control\" id=\"landing-slug\" value=\"\">\n\n                                <h4 id=\"elan\" class=\"card-title mb-4\">".concat(__('Description'), "</h4>\n\n                                <div id=\"placeholders\">\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-title-l form-label\" for=\"p-title\">").concat(__('Title'), "</label>\n                                        <input type=\"text\" class=\"form-control inp\" id=\"p-title\"\n                                            placeholder=\"").concat(__('Sushi set..'), "\">\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-descshort-l form-label\" for=\"p-sdesc\">").concat(__('Short Description'), "</label>\n                                        <textarea class=\"form-control inp\" id=\"p-sdesc\" placeholder=\"  \" maxlength=\"120\" rows=\"2\"></textarea>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-descshort-l form-label\" for=\"desc\">").concat(__('Images'), "</label>\n                                        <div class=\"clearfix\"></div>\n                                        <div class=\"ic\"></div>\n                                        <div class=\"clearfix\"></div>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <div class=\"clearfix\"></div>\n                                        <div style=\"clear:both;margin-top:16px;\"></div>\n                                        <label class=\"banner-descshort-l form-label\" for=\"p-desc\">").concat(__('Description'), "</label>\n                                        <textarea class=\"form-control inp\" id=\"p-ldesc\" placeholder=\" \" maxlength=\"2000\" rows=\"10\"></textarea>\n                                    </div>\n\n                                    <div class=\"mb-3 mw\">\n                                        <div class=\"list-wrapper\">\n                                            <ul class=\"d-flex flex-column-reverse features\"> </ul>\n                                        </div>\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"bg-light price_group mt-3 mb-3 p-4\">\n                                        <h4 class=\"card-title mb-3\">").concat(__('Price'), "</h4>\n                                        <div class=\"price_group_base\">\n                                            <div class=\"mb-3 mw\">\n                                                <div class=\"input-group\">\n\n                                                    <div id=\"p-price-c\">\n                                                        <label for=\"p-price\" class=\"form-label\">").concat(__('Price normal'), " <span class=\"lang\"></span></label>\n                                                        <div class=\"input-group\">\n                                                            <span class=\"input-group-text\">$</span>\n                                                            <input id=\"p-price\" type=\"text\" class=\"form-control inp\" placeholder=\"55.00\" autocomplete=\"off\">\n                                                        </div>\n                                                    </div>\n                                                    <div id=\"p-priced-c\">\n                                                        <label for=\"p-priced\" class=\"form-label\">").concat(__('Discounted'), " <span class=\"lang\"></span></label>\n                                                        <input id=\"p-priced\" type=\"text\" class=\"form-control inp\" placeholder=\"45.00\" autocomplete=\"off\">\n                                                    </div>\n\n                                                </div>\n                                                <div class=\"add-mix-ctn\"><a class=\"add-mix-block\" href=\"#\" data-action=\"add\">").concat(__('+ add variation'), "</a></div>\n                                            </div>\n\n                                            <div class=\"variation-blocks\">\n\n                                            </div>\n\n                                            <div style='margin:24px 0 48px;border-bottom:0px solid #ccc;'></div>\n\n                                            <div class=\"mb-3 mw\">\n                                                <h4 id=\"elan\" class=\"card-title\">").concat(__('Inventory'), "</h4>\n                                                <label for=\"p-sku\" class=\"form-label\"> <span class=\"lang\"></span></label>\n                                                <div class=\"input-group\">\n                                                    <input id=\"p-sku\" type=\"text\" style=\"width:100%;\" class=\"form-control inp\" placeholder=\"\" maxlength=\"200\">\n                                                    <p class=\"form-text\">\n                                                        Product stock unit identification number\n                                                    </p>\n                                                </div>\n                                            </div>\n\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div class=\"desc-repeater-cont\">\n\n                                </div>\n\n                                <p class=\"form-text\"> &nbsp;</p>\n\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"col-lg-3 grid-margin grid-margin-lg-0 grid-margin-md-0\">\n\n            <div class=\"row\">\n                <div class=\"col-12 grid-margin stretch-card\">\n                    <div class=\"card border-white shadow-sm p-sm-3\">\n                        <div class=\"card-body\">\n\n                            <h4 class=\"card-title\" style=\"display:none;\">").concat(__('General'), "</h4>\n                            <div class=\"landing_status\"></div>\n                            <input type=\"hidden\" class=\"form-control\" id=\"landing-slug\" value=\"\">\n\n                            <h4 id=\"elan\" class=\"card-title mb-4\">Status</h4>\n                            <div id=\"status-cont\" class=\"mb-3\">\n\n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <label class=\"form-check-label status-publish form-label\">\n                                            <input type=\"radio\" class=\"form-check-input\" name=\"p-status\"\n                                                id=\"p-status1\" value=\"1\">\n                                                ").concat(__('Published'), "\n                                        </label>\n                                    </div>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <label class=\"form-check-label status-draft form-label\">\n                                            <input type=\"radio\" class=\"form-check-input\" name=\"p-status\"  id=\"p-status0\" value=\"0\">\n                                            ").concat(__('Draft'), "\n                                        </label>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <h4 id=\"elan\" class=\"card-title mb-4\">Categories</h4>\n                            <div id=\"p-cats\" class=\"simple-tags mb-4\" data-simple-tags=\"\"></div>\n                            <div class=\"clearfix\"> </div>\n\n                            <div class=\"d-grid gap-2\">\n                                <button class=\"btn btn-primary btn-save\" type=\"button\">").concat(__('Save'), "</button>\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n    </div>\n  </div>\n\n  <div class=\"modal p-modal\" tabindex=\"-1\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\"></h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n            </div>\n        </div>\n    </div>\n  </div>\n\n  <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n    <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n        aria-atomic=\"true\" data-bs-delay=\"3000\">\n        <div class=\"d-flex\">\n            <div class=\"toast-body\"></div>\n            <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n        </div>\n    </div>\n  </div>\n  ");
  };

  var _this = {
    init: function init() {
      _this.getData();
    },
    state: {
      ajaxQueue: 0
    },
    getData: function getData() {
      showLoader();
      var id = getProductId();
      getSiteId();
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
            product: {
              type: 'find',
              key: 'ecommerce-product',
              id: id,
              fields: ['_id', 'id', 'img', 'status', 'price', 'variations', 'priced', 'title', 'sdesc', 'ldesc', 'sku', 'cats', 'updated']
            },
            locale: {
              type: 'locale',
              id: 'en'
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          initHeader(response);
          document.querySelector('#contents').innerHTML = HTMLContent(__);

          if (response.product.length == 0) {
            _this.initListeners('all');

            return;
          }

          _this.renderPage(response.product);

          _this.loadImages(response.product);

          _this.initListeners('all');
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    renderPage: function renderPage(product) {
      var d = document;
      initBreadcrumbs([{
        link: link('https://dashboard/kenzap.cloud'),
        text: __('Dashboard')
      }, {
        link: link('/'),
        text: __('E-commerce')
      }, {
        link: link('/product-list/'),
        text: __('Product List')
      }, {
        text: __('Product Edit')
      }]);
      d.querySelector("#p-title").value = product.title;
      d.querySelector("#p-sdesc").value = product.sdesc;
      d.querySelector("#p-ldesc").value = product.ldesc;
      d.querySelector("#p-price").value = product.price;
      d.querySelector("#p-priced").value = product.priced;
      console.log(product.variations);

      for (var m in product.variations) {
        var vr = product.variations[m];
        var data = [];
        data['title'] = vr['title'];
        data['type'] = vr['type'];
        data['required'] = vr['required'];
        data['index'] = m;
        d.querySelector(".variation-blocks").innerHTML += _this.structMixBlock(data);

        for (var n in vr['data']) {
          var vrd = vr['data'][n];
          var _data = [];
          _data['title'] = vrd['title'];
          _data['price'] = vrd['price'];
          _data['type'] = vr['type'];
          d.querySelector(".var-block[data-index='" + m + "'] .offer-pricef").innerHTML += _this.structMixRow(_data);
        }
      }

      document.querySelector('#p-status' + product.status).checked = true;
      var pcats = document.querySelector('#p-cats');
      if (product.cats) pcats.setAttribute('data-simple-tags', product.cats);
      new simpleTags(pcats);
    },
    initListeners: function initListeners() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'partial';
      console.log('initListeners ');

      if (type == 'all') {
        onClick('.btn-save', _this.listeners.saveProduct);
        onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
      }

      onClick('.add-mix-block', _this.listeners.addMixBlock);
      onClick('.edit-block', _this.listeners.editBlock);
      onClick('.remove-block', _this.listeners.removeBlock);
      onClick('.add-mix', _this.listeners.addMixOption);
      onClick('.remove-option', _this.listeners.removeOption);
    },
    listeners: {
      editBlock: function editBlock(e) {
        e.preventDefault();
        var amb = document.querySelector('.add-mix-block');
        amb.dataset.action = 'edit';
        amb.dataset.index = e.currentTarget.dataset.index;
        setTimeout(function () {
          return simulateClick(amb);
        }, 10);
        console.log('editBlock');
      },
      removeBlock: function removeBlock(e) {
        e.preventDefault();
        var c = confirm(__('Remove entire block?'));

        if (c) {
          e.currentTarget.parentNode.parentNode.remove();
        }

        console.log('removeBlock');
      },
      addMixBlock: function addMixBlock(e) {
        e.preventDefault();
        var action = e.currentTarget.dataset.action;
        var index = e.currentTarget.dataset.index;
        e.currentTarget.dataset.action = 'add';
        console.log('index: ' + index);

        var modal_title = __('Add Variation Block');

        var title = "";
        var type = "";
        var required = 0;

        var modal_btn = __('Add'),
            modal_cancel_btn = __('Cancel');

        if (action == 'edit') {
          modal_title = __('Edit Variation Block');
          title = document.querySelector(".var-block[data-index='" + index + "']").dataset.title;
          type = document.querySelector(".var-block[data-index='" + index + "']").dataset.type;
          required = parseInt(document.querySelector(".var-block[data-index='" + index + "']").dataset.required);
          modal_btn = __('Save');
        }

        var pmodal = document.querySelector(".p-modal");
        var pmodalCont = new bootstrap.Modal(pmodal);
        pmodal.querySelector(".modal-title").innerHTML = modal_title;
        pmodal.querySelector(".btn-primary").innerHTML = modal_btn;
        pmodal.querySelector(".btn-secondary").innerHTML = modal_cancel_btn;
        pmodalCont.show();
        var modalHTml = "            <div class=\"form-cont\">                <div class=\"form-group mb-3\">                    <label for=\"mtitle\" class=\"form-label\">".concat(__('Save'), "</label>                    <input type=\"text\" class=\"form-control\" id=\"mtitle\" autocomplete=\"off\" placeholder=\"Rice type\" value=\"").concat(title, "\">                </div>                <div class=\"form-group mb-3\">                    <label for=\"mtype\" class=\"form-label\">").concat(__('Input type'), "</label>                    <select id=\"mtype\" class=\"form-control \" >                        <option ").concat(type == 'radio' ? 'selected="selected"' : '', " value=\"radio\">").concat(__('Radio buttons'), "</option>                        <option ").concat(type == 'checkbox' ? 'selected="selected"' : '', " value=\"checkbox\">").concat(__('Checkboxes'), "</option>                    </select>                    <p class=\"card-description\">").concat(__('Define how this renders on frontend.'), "</p>                </div>                <div class=\"form-group mb-3\">                    <div class=\"form-check\">                        <label for=\"id=\"mtype\"\" class=\"form-check-label form-label\">                            <input id=\"mrequired\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">                            ").concat(__('Required'), "                        </label>                    </div>                    <p class=\"card-description\">").concat(__('Make this variation mandatory for users.'), "</p>                </div>                <div class=\"form-group mb-3 dn\">                    <label for=\"mtype\" class=\"form-label\">").concat(__('Minimum required'), "</label>                    <select id=\"mtype\" class=\"form-control \" >                        <option value=\"1\">1</option>                        <option value=\"2\">2</option>                    </select>                </div>            </div>");
        pmodal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var mtitle = pmodal.querySelector(".p-modal #mtitle").value;
          var mtype = pmodal.querySelector(".p-modal #mtype").value;
          var mrequired = pmodal.querySelector(".p-modal #mrequired:checked");
          mrequired = mrequired == null ? 0 : mrequired.value == "1" ? 1 : 0;

          if (mtitle.length < 2) {
            alert(__('Please provide longer title'));
            return;
          }

          var data = [];
          data['title'] = mtitle;
          data['type'] = mtype;
          data['required'] = mrequired;
          data['index'] = document.querySelectorAll(".var-block").length;

          if (action == 'edit') {
            document.querySelector(".var-block[data-index='" + index + "']").dataset.title = mtitle;
            document.querySelector(".var-block[data-index='" + index + "']").dataset.type = mtype;
            document.querySelector(".var-block[data-index='" + index + "']").dataset.required = mrequired;
            document.querySelector(".var-block[data-index='" + index + "'] .title").innerHTML = mtitle;
          }

          if (action == 'add') {
            if (document.querySelector(".variation-blocks .var-block") == null) {
              document.querySelector(".variation-blocks").innerHTML = _this.structMixBlock(data);
            } else {
              document.querySelector(".variation-blocks .var-block:last-of-type").insertAdjacentHTML('afterend', _this.structMixBlock(data));
            }
          }

          pmodalCont.hide();
          setTimeout(function () {
            return _this.initListeners('partial');
          }, 10);
        };

        console.log('addMixBlock');
      },
      addMixOption: function addMixOption(e) {
        var block_el = e.currentTarget;
        e.preventDefault();
        var pmodal = document.querySelector(".p-modal");
        var pmodalCont = new bootstrap.Modal(pmodal);
        pmodalCont.show();
        pmodal.querySelector(".modal-title").innerHTML = __('Add Variation');
        pmodal.querySelector(".btn-primary").innerHTML = __('Add');
        pmodal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTML = "            <div class=\"form-cont\">                <div class=\"form-group\">                    <label for=\"mtitle\" class=\"form-label\">".concat(__('Title'), "</label>                    <input type=\"text\" class=\"form-control\" id=\"mtitle\" autocomplete=\"off\" placeholder=\"").concat(__('Brown rice'), "\">                </div>                <div class=\"form-group\">                    <label for=\"mprice\" class=\"form-label\">").concat(__('Price'), "</label>                    <div class=\"input-group mb-3\">\n                        <span class=\"input-group-text\">$</span>\n                        <input id=\"mprice\" type=\"text\" class=\"form-control\" placeholder=\"0.00\" value=\"\" >                        <p class=\"card-description\">").concat(__('You can change default currency under Dashboard &gt; Settings.'), "</p>                    </div>                </div>            </div>");
        pmodal.querySelector(".modal-body").innerHTML = modalHTML;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var mtitle = pmodal.querySelector(".p-modal #mtitle").value;
          var mprice = pmodal.querySelector(".p-modal #mprice").value;

          if (mtitle.length < 2) {
            alert("Please provide longer title");
            return;
          }

          var data = [];
          data['title'] = mtitle;
          data['price'] = mprice;
          data['type'] = block_el.parentElement.parentElement.dataset.type;
          var sel = ".var-block[data-index='" + block_el.parentElement.parentElement.dataset.index + "']";
          console.log(sel);

          if (document.querySelector(sel + " .offer-pricef li") == null) {
            document.querySelector(sel + " .offer-pricef").innerHTML = _this.structMixRow(data);
          } else {
            document.querySelector(sel + " .offer-pricef li:last-of-type").insertAdjacentHTML('afterend', _this.structMixRow(data));
          }

          pmodalCont.hide();
          setTimeout(function () {
            return _this.initListeners('partial');
          }, 10);
        };
      },
      removeOption: function removeOption(e) {
        e.preventDefault();
        if (confirm('Remove option?')) e.currentTarget.parentElement.remove();
        console.log('removeOption');
      },
      saveProduct: function saveProduct(e) {
        e.preventDefault();
        var data = {};

        var _iterator = _createForOfIteratorHelper(document.querySelectorAll('.inp')),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var inp = _step.value;
            data[inp.id.replace("p-", "")] = inp.value;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        data["cats"] = [];

        var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll('#p-cats ul li')),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var cat = _step2.value;
            data["cats"].push(cat.innerHTML.replace('<a>×</a>', '').trim());
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        data["img"] = [];

        var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll('.p-img')),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var img = _step3.value;
            var tf = !img.getAttribute('src').includes("placeholder") ? true : false;
            data["img"].push(tf);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        data["status"] = document.querySelector('input[name="p-status"]:checked').value;
        data["variations"] = [];
        var block_index = 0;

        var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll('.variation-blocks .var-block')),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var block = _step4.value;
            var option_index = 0;

            var _iterator5 = _createForOfIteratorHelper(block.querySelectorAll('.offer-pricef li')),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var option = _step5.value;
                if (typeof data["variations"][block_index] === 'undefined') data["variations"][block_index] = {
                  'title': block.getAttribute('data-title'),
                  'type': block.getAttribute('data-type'),
                  'required': block.getAttribute('data-required'),
                  'data': []
                };
                data["variations"][block_index]['data'][option_index] = {
                  'title': option.getAttribute('data-title'),
                  'price': option.getAttribute('data-price'),
                  'cond': option.getAttribute('data-cond')
                };
                option_index++;
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            block_index++;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        console.log(data);
        var id = getProductId();
        var sid = getSiteId();
        showLoader();
        fetch('https://api-v1.kenzap.cloud/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + getCookie('kenzap_api_key')
          },
          body: JSON.stringify({
            query: {
              product: {
                type: 'update',
                key: 'ecommerce-product',
                id: id,
                sid: sid,
                data: data
              }
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            _this.uploadImages();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
        console.log('saveProduct');
      },
      openImage: function openImage(e) {
        e.preventDefault();
        simulateClick(document.querySelector(".aif-" + e.currentTarget.dataset.index));
      },
      previewImage: function previewImage(e) {
        e.preventDefault();
        var input = e.currentTarget;
        var toast = new bootstrap.Toast(document.querySelector('.p-toast'));

        if (input.files && input.files[0]) {
          if (input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/jpg' && input.files[0].type != 'image/png') {
            document.querySelector('.p-toast .toast-body').innerHTML = __('Please provide image in JPEG format');
            toast.show();
            return;
          }

          if (input.files[0].size > 5000000) {
            document.querySelector('.p-toast .toast-body').innerHTML = __('Please provide image less than 5 MB in size!');
            toast.show();
            return;
          }

          var index = input.dataset.index;
          var reader = new FileReader();

          reader.onload = function (e) {
            console.log('target ' + e.currentTarget.result);
            document.querySelector('.images-' + index).setAttribute('src', e.currentTarget.result);
          };

          reader.readAsDataURL(input.files[0]);
          e.currentTarget.parentElement.querySelector('.remove').classList.remove("hd");
        }
      },
      removeImage: function removeImage(e) {
        var index = e.currentTarget.parentElement.dataset.index;
        document.querySelector('.aif-' + index).value = '';
        document.querySelector('.images-' + index).setAttribute('src', 'https://account.kenzap.com/images/placeholder.jpg');
        e.currentTarget.classList.add("hd");
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        console.log('calling modalSuccessBtnFunc');

        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    structMixBlock: function structMixBlock(data) {
      var html = '\
        <div class="mb-4 var-block mw" data-title="' + data.title + '" data-type="' + data.type + '" data-required="' + data.required + '" data-index="' + data.index + '" >\
            <label for="offer-pricef" class="form-label pb-2"><span class="title">' + data.title + '</span>\
                &nbsp;&nbsp;\
                <svg class="bi bi-pencil-fill edit-block ms-4" title="edit block" data-index="' + data.index + '" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">\
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>\
                </svg>\
                <svg class="bi bi-trash remove-block ms-4" title="edit block" data-index="' + data.index + '"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" viewBox="0 0 16 16">\
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>\
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>\
                </svg>\
            </label>\
            <div class="list-wrapper">\
                <ul class="d-flex flex-column-reverse offer-pricef" >\
                \
                </ul>\
            </div>\
            <p class="card-description"><a class="add-mix" href="#">+ add option</a> to differentiate price and product options.</p>\
            <div class="add-mix-ctn d-none"><a class="add-mix" href="#">+ add option</a></div>\
        </div>\
        ';
      return html;
    },
    structMixRow: function structMixRow(data) {
      return '\
        <li data-title="' + data.title + '" data-price="' + data.price + '" data-cond="" class="pt-2 pb-2"><div class="form-check"><label class="form-check-label form-label"><input class="' + data.type + ' form-check-input" type="' + data.type + '" checked="" data-ft="' + data.title + '">' + data.title + ' &nbsp;&nbsp;&nbsp; ' + formatPrice(data.price) + '</label></div>\
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-option bi bi-x-circle" viewBox="0 0 16 16">\
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\
            </svg>\
        </li>';
    },
    loadImages: function loadImages(product) {
      var d = document;
      var id = getProductId();
      var sid = getSiteId();
      var t = '';

      for (var i = 0; i < 5; i++) {
        var img = product.img !== undefined && product.img[i] == 'true' ? 'https://preview.kenzap.cloud/S' + getSiteId() + '/_site/images/product-' + product.id + '-' + (i + 1) + '-100x100.jpeg?' + product.updated : 'https://account.kenzap.com/images/placeholder.jpg';
        t += "          <div class=\"p-img-cont float-start\">            <p data-index=\"".concat(i, "\">              <img class=\"p-img images-").concat(i, "\" data-index=\"").concat(i, "\" width=\"100\" height=\"100\" src=\"").concat(img, "\" />              <span class=\"remove hd\" title=\"").concat(__('Remove'), "\">\xD7</span>            </p>            <input type=\"file\" name=\"img[]\" data-type=\"search\" data-index=\"").concat(i, "\" class=\"file aif-").concat(i, " d-none\">          </div>");
      }

      d.querySelector(".ic").innerHTML = t;
      onClick('.p-img-cont img', _this.listeners.openImage);
      onClick('.p-img-cont .remove', _this.listeners.removeImage);
      onChange('.p-img-cont .file', _this.listeners.previewImage);

      for (var fi = 0; fi < 5; fi++) {
        var image_url = CDN + '/S' + sid + '/product-' + id + '-' + (parseInt(fi) + 1) + '-250.jpeg?' + product.updated;
        setTimeout(function (img, sel, _fi) {
          var allow = true;

          if (typeof product.img !== "undefined") {
            if (!product.img[_fi]) allow = false;
          }

          if (allow) {
            var _i = new Image();

            _i.onload = function () {
              d.querySelector(sel + _fi).setAttribute('src', img);
              d.querySelector(sel + _fi).parentElement.querySelector('.remove').classList.remove('hd');
            };

            _i.src = img;
          }
        }, 300, image_url, ".images-", fi);
      }
    },
    uploadImages: function uploadImages() {
      if (document.querySelector(".imgupnote")) document.querySelector(".imgupnote").remove();
      var fi = 0;

      var _iterator6 = _createForOfIteratorHelper(document.querySelectorAll(".file")),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var fileEl = _step6.value;
          fi += 1;
          var id = getProductId();
          var sid = getSiteId();
          var file = fileEl.files[0];
          if (typeof file === "undefined") continue;
          var fd = new FormData();
          var sizes = '1000|500|250|100x100';
          fd.append('id', id);
          fd.append('sid', sid);
          fd.append('pid', id);
          fd.append('key', 'image');
          fd.append('sizes', sizes);
          fd.append('file', file);
          fd.append('slug', 'product-' + id + '-' + fi);
          fd.append('token', getCookie('kenzap_token'));
          file.value = '';
          _this.state.ajaxQueue += 1;
          fetch("https://api-v1.kenzap.cloud/upload/", {
            body: fd,
            method: "post"
          }).then(function (response) {
            return response.json();
          }).then(function (response) {
            _this.state.ajaxQueue -= 1;

            if (response.success && _this.state.ajaxQueue == 0) {
              var _toast2 = new bootstrap.Toast(document.querySelector('.toast'));

              document.querySelector('.toast .toast-body').innerHTML = __('Order updated');

              _toast2.show();

              hideLoader();
            }
          });
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      if (_this.state.ajaxQueue == 0) {
        var _toast = new bootstrap.Toast(document.querySelector('.toast'));

        document.querySelector('.toast .toast-body').innerHTML = __('Order updated');

        _toast.show();

        hideLoader();
      }
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
