
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35732/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

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

  var link = function link(slug) {
    var urlParams = new URLSearchParams(window.location.search);
    var sid = urlParams.get('sid') ? urlParams.get('sid') : "";
    var postfix = slug.indexOf('?') == -1 ? '?sid=' + sid : '&sid=' + sid;
    return slug + postfix;
  };
  var getSiteId = function getSiteId() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('sid') ? urlParams.get('sid') : "";
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
  var getCookie = function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return "";
  };
  var parseApiError = function parseApiError(data) {
    switch (data.code) {
      default:
        alert(data.reason);
        break;
    }
  };
  var initBreadcrumbs = function initBreadcrumbs(data) {
    var html = '<ol class="breadcrumb mt-2 mb-0">';

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var bc = _step2.value;

        if (typeof bc.link === 'undefined') {
          html += "<li class=\"breadcrumb-item\">".concat(bc.text, "</li>");
        } else {
          html += "<li class=\"breadcrumb-item\"><a href=\"".concat(bc.link, "\">").concat(bc.text, "</a></li>");
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    html += '</ol>';
    document.querySelector(".bc").innerHTML = html;
  };
  var simulateClick = function simulateClick(elem) {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    !elem.dispatchEvent(evt);
  };
  var onClick = function onClick(sel, fn) {
    if (document.querySelector(sel)) {
      var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll(sel)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var e = _step3.value;
          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  };
  var onKeyUp = function onKeyUp(sel, fn) {
    if (document.querySelector(sel)) {
      var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll(sel)),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var e = _step4.value;
          e.removeEventListener('keyup', fn, true);
          e.addEventListener('keyup', fn, true);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  };
  var timeConverterAgo = function timeConverterAgo(now, time) {
    console.log(now + " " + time);
    now = parseInt(now);
    time = parseInt(time);
    console.log(now + " " + time);
    var past = now - time;
    if (past < 60) return 'moments ago';
    if (past < 3600) return parseInt(past / 60) + ' minutes ago';
    if (past < 86400) return parseInt(past / 60 / 24) + ' hours ago';
    var a = new Date(time * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    a.getHours();
    a.getMinutes();
    a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
  };

  var showLoader = function showLoader() {
    var el = document.querySelector(".loader");
    if (el) el.style.display = 'block';
  };
  var hideLoader = function hideLoader() {
    var el = document.querySelector(".loader");
    if (el) el.style.display = 'none';
  };
  var initFooter = function initFooter(left, right) {
    document.querySelector("footer .row").innerHTML = "\n    <div class=\"d-sm-flex justify-content-center justify-content-sm-between\">\n        <span class=\"text-muted text-center text-sm-left d-block d-sm-inline-block\">".concat(left, "</span>\n        <span class=\"float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted\">").concat(right, "</span>\n    </div>");
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n      <div class=\"container ec-orders\">\n        <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n            <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-md-12 page-title\">\n            <div class=\"st-opts st-table mb-3 dropdown\">\n                <a class=\"btn btn-primary dropdown-toggle\" href=\"#\" role=\"button\" id=\"order-status\" data-id=\"status\" data-value=\"\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                  All\n                </a>\n                <ul class=\"dropdown-menu\" aria-labelledby=\"order-status\">\n                  <li><a class=\"dppi dropdown-item\" data-key=\"\" href=\"#\" >All</a></li>\n                  <li><a class=\"dppi dropdown-item\" data-key=\"new\" href=\"#\" >New</a></li>\n                  <li><a class=\"dppi dropdown-item\" data-key=\"processing\" href=\"#\" >Processing</a></li>\n                  <li><a class=\"dppi dropdown-item\" data-key=\"completed\" href=\"#\" >Completed</a></li>\n                  <li><a class=\"dppi dropdown-item\" data-key=\"canceled\" href=\"#\" >Canceled</a></li>\n                  <li><a class=\"dppi dropdown-item\" data-key=\"failed\" href=\"#\" >Failed</a></li>\n                </ul>\n            </div>\n            <div class=\"st-opts\" >\n              <div class=\"input-group-sm mb-0 justify-content-start\" >\n                <input id=\"usearch\" type=\"text\" class=\"inp form-control search-input\" placeholder=\"".concat(__('Search order'), "\">\n              </div>\n              <!-- <a id=\"viewSum\" href=\"#\" style=\"margin-left:16px;\">view summary</a> -->\n            </div>\n          </div>\n        </div>\n\n        <div class=\"row\">\n          <div class=\"col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n            <div class=\"card border-white shadow-sm\">\n              <div class=\"card-body\">\n \n                <div class=\"table-responsive\">\n                  <table class=\"table table-hover table-borderless align-middle table-striped table-p-list\">\n                    <thead>\n                      <tr>\n\n                        <th>From</th>\n                        <th>Status</th>\n                        <th>Total</th>\n                        <th>Time</th>\n                        <th></th>\n                      </tr>\n                    </thead>\n                    <tbody class=\"list\">\n\n                    </tbody>\n                  </table>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"modal order-modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog \">\n          <div class=\"modal-content\">\n              <div class=\"modal-header\">\n                <h5 class=\"modal-title\"></h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n              </div>\n              <div class=\"modal-body\">\n              \n              </div>\n              <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-primary\"></button>\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n              </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"position-fixed bottom-0 p-sm-2 m-sm-4 end-0 align-items-center\" >   \n        <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" data-bs-delay=\"3000\">\n          <div class=\"d-flex\">  \n            <div class=\"toast-body\"></div>\n            <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n          </div>\n        </div>\n      </div>\n    ");
  };

  var i18n = {
    state: {
      locale: null
    },
    init: function init(locale) {
      i18n.state.locale = locale;
    },
    __: function __(text) {
      if (i18n.state.locale.values[text] === undefined) return text;
      return i18n.state.locale.values[text];
    }
  };

  var __ = i18n.__;
  var _this = {
    state: {
      firstLoad: true,
      firstTouch: true,
      playSoundNow: false,
      newOrderCount: 0,
      orderIDs: [],
      orders: [],
      playTitleTimer: null,
      refreshTimer: null,
      statuses: [],
      audio: new Audio('https://kenzap.com/static/swiftly.mp3'),
      limit: 50
    },
    init: function init() {
      _this.getData();

      _this.state.refreshTimer = setInterval(function () {
        _this.getData();
      }, 7000);
    },
    getData: function getData() {
      if (_this.state.firstLoad) showLoader();
      var s = document.querySelector('.search-input') ? document.querySelector('.search-input').value : '';
      var term = document.querySelector('#order-status') ? document.querySelector('#order-status').dataset.value : '';
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
            user: {
              type: 'authenticate',
              fields: ['avatar'],
              token: getCookie('kenzap_token')
            },
            locale: {
              type: 'locale',
              id: getCookie('lang')
            },
            orders: {
              type: 'find',
              key: 'ecommerce-order',
              fields: '*',
              term: term != '' ? 'status=\'' + term + '\'' : '',
              limit: _this.state.limit,
              search: {
                field: 'from',
                s: s
              },
              sortby: {
                field: 'created',
                order: 'DESC'
              }
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          i18n.init(response.locale);

          _this.loadPageStructure();

          _this.renderPage(response);

          _this.initHeader(response);

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
    initHeader: function initHeader(response) {
      onClick('.nav-back', function (e) {
        e.preventDefault();
        var link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
        simulateClick(link);
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
          text: __('Orders')
        }]);
        _this.state.statuses = {
          'new': {
            text: __('New'),
            "class": 'btn-warning text-dark fw-light'
          },
          'processing': {
            text: __('Processing'),
            "class": 'btn-primary fw-light'
          },
          'completed': {
            text: __('Completed'),
            "class": 'btn-success fw-light'
          },
          'canceled': {
            text: __('Canceled'),
            "class": 'btn-secondary fw-light'
          },
          'failed': {
            text: __('Failed'),
            "class": 'btn-danger fw-light'
          }
        };
      }

      _this.state.orders = response.orders;

      if (response.orders.length == 0) {
        document.querySelector(".table tbody").innerHTML = "<tr><td colspan=\"5\">".concat(__("No orders to display."), "</td></tr>");
        return;
      }

      var orderIDsTemp = [];
      _this.state.newOrderCount = [];
      var list = '',
          count_new = 0;

      for (var i in response.orders) {
        orderIDsTemp.push(response.orders[i]._id);
        if (typeof response.orders[i].status === 'undefined') response.orders[i].status = 'new';
        if (response.orders[i].status == 'new') count_new++;
        var classN = _this.state.orderIDs.includes(response.orders[i]._id) || _this.state.firstLoad ? '' : 'new';
        list += "\n            <tr class=\"".concat(classN, "\">\n              <td class=\"destt\" style=\"max-width:250px;min-width:250px;\">\n                <div>\n                  <b>").concat(response.orders[i].from, "</b><div class=\"elipsized fst-italic\">").concat(response.orders[i].note, "</div>\n                </div>\n              </td>\n              <td>\n                <span style=\"font-size:24px;\">").concat(_this.getStatus(response.orders[i].status), "</span>\n              </td>\n              <td>\n                <span style=\"font-size:18px;\">").concat(formatPrice(response.orders[i].total), "</span>\n              </td>\n              <td class=\"\">\n                <span style=\"font-size:18px;\">").concat(timeConverterAgo(response.meta.time, response.orders[i].created), "</span>\n              </td>\n              <td class=\"last\">\n                <a href=\"#\" data-id=\"").concat(response.orders[i]._id, "\" data-index=\"").concat(i, "\" class=\"view-order text-success me-4\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" class=\"bi bi-eye\" viewBox=\"0 0 16 16\">\n                    <path d=\"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z\"/>\n                    <path d=\"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z\"/>\n                </svg></a>\n                <a href=\"#\" data-id=\"").concat(response.orders[i]._id, "\" data-index=\"").concat(i, "\" class=\"remove-order text-danger \"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n                    <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                    <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                </svg></a>\n              </td>\n            </tr>");
      }

      _this.state.playSoundNow = count_new > 0 ? true : false;
      _this.state.orderIDs = orderIDsTemp;
      document.querySelector(".table tbody").innerHTML = list;
    },
    getStatus: function getStatus(status) {
      return "<div class=\"badge ".concat(_this.state.statuses[status]["class"], "\">").concat(_this.state.statuses[status].text, "</div>");
    },
    playSound: function playSound() {
      console.log('playSound');

      _this.state.audio.play();
    },
    playTitle: function playTitle(msg) {},
    initListeners: function initListeners() {
      onClick('.view-order', _this.listeners.viewOrder);
      onClick('.remove-order', _this.listeners.removeOrder);
      onClick('.st-table li a', _this.listeners.changeStatus);
      if (!_this.state.firstLoad) return;
      onClick('.modal .btn-primary', _this.listeners.modalSuccessBtn);
      onKeyUp('.search-input', _this.listeners.searchOrders);
      document.body.addEventListener('touchstart', function () {
        if (_this.state.firstTouch) {
          _this.state.audio.play();

          _this.state.audio.pause();

          _this.state.audio.currentTime = 0;
          _this.state.firstTouch = false;
        } else {
          if (_this.state.playTitleTimer) clearInterval(_this.state.playTitleTimer);
          _this.state.playTitleTimer = setInterval(function () {
            if (_this.state.playSoundNow) _this.playSound();
          }, 6500);
        }
      }, false);
    },
    listeners: {
      changeStatus: function changeStatus(e) {
        e.preventDefault();
        console.log(e.currentTarget.dataset.key);
        var os = document.querySelector('#order-status');

        if (e.currentTarget.dataset.key == "") {
          os.innerHTML = __('All');
          os.dataset.value = '';
        } else {
          os.innerHTML = _this.state.statuses[e.currentTarget.dataset.key].text;
          os.dataset.value = e.currentTarget.dataset.key;
        }

        var list = [];
        Object.keys(_this.state.statuses).forEach(function (key) {
          list = _this.state.statuses[key]["class"].split(' ');
          list.forEach(function (key) {
            os.classList.remove(key);
          });
        });

        if (e.currentTarget.dataset.key == '') {
          os.classList.add('btn-primary');
        } else {
          list = _this.state.statuses[e.currentTarget.dataset.key]["class"].split(' ');
          list.forEach(function (key) {
            os.classList.add(key);
          });
        }

        _this.getData();
      },
      viewOrder: function viewOrder(e) {
        var _fields;

        var modal = document.querySelector(".order-modal");
        var modalCont = new bootstrap.Modal(modal);
        var i = e.currentTarget.dataset.index;
        var items = '';
        Object.keys(_this.state.statuses).forEach(function (key, index) {
          console.log(key);
          items += "<li><a class=\"dppi dropdown-item\" data-key=\"".concat(key, "\" href=\"#\">").concat(_this.state.statuses[key].text, "</a></li>");
        });
        var statusSelect = "\n            <div class=\"st-modal st-opts mb-3 me-3 dropdown\">\n                <a class=\"btn btn-sm ".concat(_this.state.statuses[_this.state.orders[i]['status']]["class"], " dropdown-toggle order-form\" data-id=\"status\" data-type=\"key\" data-value=\"new\" href=\"#\" role=\"button\" id=\"order-status-modal\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\" >\n                    ").concat(_this.state.statuses[_this.state.orders[i]['status']].text, "\n                </a>\n                <ul class=\"dropdown-menu\" aria-labelledby=\"order-status-modal\">\n                    ").concat(items, "\n                </ul>\n            </div>");
        modal.querySelector(".modal-dialog").classList.add('modal-dialog-wide');
        modal.querySelector(".modal-header .modal-title").innerHTML = statusSelect + _this.state.orders[i]['from'];
        modal.querySelector(".modal-footer .btn-primary").innerHTML = __('Update');
        modal.querySelector(".modal-footer .btn-secondary").innerHTML = __('Close');
        var html = "";
        console.log(i);
        console.log(_this.state.orders[i]._id);
        var fields = (_fields = {
          _id: {
            l: "ID"
          },
          from: {
            l: "From",
            e: "text",
            editable: true
          },
          items: {
            l: "",
            e: "items"
          },
          fname: {
            l: "Name",
            e: "text"
          },
          lname: {
            l: "Surname",
            e: "text"
          },
          bios: {
            l: "Bios",
            e: "textarea"
          },
          avatar: {
            l: "Avatar",
            e: "text"
          },
          email: {
            l: "Email",
            e: "text"
          },
          countryr: {
            l: "Country",
            e: "text"
          },
          cityr: {
            l: "City",
            e: "text"
          },
          addr1: {
            l: "Address 1",
            e: "textarea"
          },
          addr2: {
            l: "Address 2",
            e: "textarea"
          },
          post: {
            l: "Post",
            e: "text"
          },
          state: {
            l: "State",
            e: "text"
          },
          c1: {
            l: "Whatsapp",
            e: "text"
          },
          c2: {
            l: "Messenger",
            e: "text"
          },
          c3: {
            l: "Line",
            e: "text"
          },
          c4: {
            l: "Email",
            e: "text"
          },
          c5: {
            l: "Telegram",
            e: "text"
          }
        }, _defineProperty(_fields, "email", {
          l: "Email",
          e: "text"
        }), _defineProperty(_fields, "bio", {
          l: "Bio",
          e: "text"
        }), _defineProperty(_fields, "y1", {
          l: "Name",
          e: "text"
        }), _defineProperty(_fields, "y2", {
          l: "IBAN",
          e: "text"
        }), _defineProperty(_fields, "y3", {
          l: "SWIFT",
          e: "text"
        }), _defineProperty(_fields, "y4", {
          l: "Bank",
          e: "text"
        }), _defineProperty(_fields, "y5", {
          l: "Bank city",
          e: "text"
        }), _defineProperty(_fields, "y6", {
          l: "Bank country",
          e: "text"
        }), _defineProperty(_fields, "note", {
          l: "Note",
          e: "textarea"
        }), _defineProperty(_fields, "total", {
          l: "Total",
          e: "text"
        }), _defineProperty(_fields, "s3", {
          l: "Link 3",
          e: "text"
        }), _defineProperty(_fields, "company", {
          l: "Company",
          e: "text"
        }), _defineProperty(_fields, "vat", {
          l: "Tax ID",
          e: "text"
        }), _defineProperty(_fields, "grade", {
          l: "Grade",
          e: "text"
        }), _defineProperty(_fields, "kenzap_ida", {
          l: "Kenzap IDA",
          e: "text"
        }), _fields);

        for (var x in fields) {
          if (_this.state.orders[i][x] === undefined) continue;
          var val = _this.state.orders[i][x];
          var field = fields[x].l;

          if (x == 'total') {
            val = formatPrice(val);
          }

          html += '\
                <div class="mb-3 mt-3">\
                    <b>' + field + '</b>&nbsp;' + _this.renderField(fields[x], val, x) + '\
                </div>';
        }

        html += '';
        modal.querySelector(".modal-body").innerHTML = html;
        modalCont.show();

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();

          _this.updateOrder(_this.state.orders[i]._id);

          modalCont.hide();
        };

        onClick('.st-modal li a', function (e) {
          e.preventDefault();
          console.log(e.currentTarget.dataset.key);
          var osm = document.querySelector('#order-status-modal');
          osm.innerHTML = _this.state.statuses[e.currentTarget.dataset.key].text;
          osm.dataset.value = e.currentTarget.dataset.key;
          var list = [];
          Object.keys(_this.state.statuses).forEach(function (key) {
            list = _this.state.statuses[key]["class"].split(' ');
            list.forEach(function (key) {
              osm.classList.remove(key);
            });
          });
          list = _this.state.statuses[e.currentTarget.dataset.key]["class"].split(' ');
          list.forEach(function (key) {
            osm.classList.add(key);
          });
        });
      },
      removeOrder: function removeOrder(e) {
        e.preventDefault();
        var c = confirm(__('Completely remove this order?'));
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
                key: 'ecommerce-order',
                id: e.currentTarget.dataset.id,
                sid: getSiteId()
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
      searchOrders: function searchOrders(e) {
        e.preventDefault();

        _this.getData();
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        console.log('calling modalSuccessBtnFunc');

        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    renderField: function renderField(a, b, x) {
      switch (a.e) {
        case 'text':
          return b;

        case 'textarea':
          return '<textarea type="text" rows="4" class="form-control order-form pv " data-type="textarea" id="' + x + '" value="' + b + '">' + b + '</textarea>';

        case 'items':
          var html = '<table class="items"><tr><th>Product</th><th class="qty">Quantity</th><th class="tp">Total</th></tr>';

          for (var _x in b) {
            var vars = '';

            for (var v in b[_x].variations) {
              var list = '';

              for (var l in b[_x].variations[v].list) {
                list += b[_x].variations[v].list[l].title + " ";
              }

              vars += '<div><b>' + b[_x].variations[v].title + "</b> <span>" + list + "</span></div> ";
              if (b[_x].variations[v].note !== undefined && b[_x].variations[v].note.length > 0) vars += "<div><b>Note</b> " + b[_x].variations[v].note + "</div> ";
            }

            html += '<tr>';
            html += '<td><div>' + b[_x].title + '</div><div>' + b[_x].note + '</div><div class="vars border-primary">' + vars + '</div></td><td class="qty"><span>' + b[_x].qty + '</span></td><td class="tp"><span>' + formatPrice(b[_x].priceF) + '</span></td>';
            html += '</tr>';
          }

          html += '</table>';
          return html;

        default:
          return b;
      }
    },
    updateOrder: function updateOrder(id) {
      var data = {};

      var _iterator = _createForOfIteratorHelper(document.querySelectorAll('.order-form')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var s = _step.value;

          switch (s.dataset.type) {
            case 'key':
              data[s.dataset.id] = s.dataset.value;
              break;

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
        _iterator.e(err);
      } finally {
        _iterator.f();
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
              type: 'update',
              key: 'ecommerce-order',
              sid: getSiteId(),
              id: id,
              data: data
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          var toast = new bootstrap.Toast(document.querySelector('.toast'));
          document.querySelector('.toast .toast-body').innerHTML = __('Order updated');
          toast.show();

          _this.getData();
        } else {
          parseApiError(response);
        }

        console.log('Success:', response);
      })["catch"](function (error) {
        console.error('Error:', error);
      });
      console.log('saveOrder');
    },
    initFooter: function initFooter$1() {
      initFooter(__('Copyright © ' + new Date().getFullYear() + ' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
