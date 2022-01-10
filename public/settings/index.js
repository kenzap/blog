
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
    return "\n    <div class=\"container p-edit\">\n        <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n            <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n            <button class=\"btn btn-primary btn-save\" type=\"button\">".concat(__('Save changes'), "</button>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n              <div class=\"card border-white shadow-sm p-sm-3\">\n                <nav class=\"nav tab-content mb-4\" role=\"tablist\">\n                    <div class=\"nav nav-tabs\" id=\"nav-tab\" role=\"tablist\">\n                        <a class=\"nav-link active\" id=\"nav-notifications-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-notifications\" type=\"button\" role=\"tab\" aria-controls=\"nav-notifications\" aria-selected=\"true\" href=\"#\">").concat(__('Notifications'), "</a>\n                        <a class=\"nav-link\" id=\"nav-currency-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-currency\" type=\"button\" role=\"tab\" aria-controls=\"nav-currency\" aria-selected=\"true\" href=\"#\">").concat(__('Currency'), "</a>\n                        <a class=\"nav-link\" id=\"nav-payout-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-payout\" type=\"button\" role=\"tab\" aria-controls=\"nav-payout\" aria-selected=\"true\"  href=\"#\">").concat(__('Payout'), "</a>\n                        <a class=\"nav-link\" id=\"nav-tax-link\" data-bs-toggle=\"tab\" data-bs-target=\"#nav-tax\" type=\"button\" role=\"tab\" aria-controls=\"nav-tax\" aria-selected=\"true\"  href=\"#\">").concat(__('Tax'), "</a>\n                    </div>\n                </nav>\n                <div class=\"card-body tab-content\" id=\"nav-tabContent\">\n                    <div class=\"tab-pane fade show active\" id=\"nav-notifications\" role=\"tabpanel\" aria-labelledby=\"nav-notifications-link\">\n                    <h4 id=\"gen\" class=\"card-title mb-4\">").concat(__('Notification settings'), "</h4>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('New order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_new_order\" class=\"form-control inp\" name=\"notify_new_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_new_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_new_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Cancelled order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_cancel_order\" class=\"form-control inp\" name=\"notify_cancel_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_cancel_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_cancel_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Processing order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_proc_order\" class=\"form-control inp\" name=\"notify_proc_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_proc_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_proc_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Refunded order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_refunded_order\" class=\"form-control inp\" name=\"notify_refunded_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_refunded_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_refunded_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Refunded order'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"notify_completed_order\" class=\"form-control inp\" name=\"notify_completed_order\" data-type=\"select\">\n                                <option value=\"\">").concat(__('None'), "</option>\n                                <option value=\"client\">").concat(__('Client'), "</option>\n                                <option value=\"admin\">").concat(__('Administrator'), "</option>\n                                <option value=\"both\">").concat(__('Client and administrator'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Admin emails'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"notify_completed_order_emails\" type=\"text\" class=\"form-control inp\" name=\"notify_completed_order_emails\" data-type=\"emails\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-currency\" role=\"tabpanel\" aria-labelledby=\"nav-currency-link\">\n                    <h4 id=\"gen\" class=\"card-title mb-4\">").concat(__('Currency settings'), "</h4>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"currency\" class=\"form-control inp\" name=\"currency\" data-type=\"select\">\n                              <?php include('inc/select-currencies.php'); ?>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency symbol'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"currency_symb\" type=\"text\" class=\"form-control inp\" name=\"currency_symb\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Currency position'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"currency_symb_loc\" class=\"form-control inp\" name=\"currency_symb_loc\" data-type=\"select\">\n                              <option value=\"left\">").concat(__('Left'), "</option>\n                              <option value=\"right\">").concat(__('Right'), "</option>\n                              <option value=\"left_space\">").concat(__('Left with space'), "</option>\n                              <option value=\"right_space\">").concat(__('Right with space'), "</option>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-tax\" role=\"tabpanel\" aria-labelledby=\"nav-tax-link\">\n                    <h4 id=\"tax\" class=\"card-title mb-4\">").concat(__('Your tax informatio'), "</h4>\n                    <p class=\"card-description\"> ").concat(__('Invoice info (this information will be not revealed public)'), " </p>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Tax ID'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"vat\" type=\"text\" class=\"form-control inp\" name=\"vat\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Email'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"email\" type=\"email\" class=\"form-control inp\" name=\"email\" data-type=\"email\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Company'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"company\" type=\"text\" class=\"form-control inp inp\" name=\"company\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Type'), "</label>\n                          <div class=\"col-sm-4\">\n                            <div class=\"form-check\">\n                              <label class=\"form-check-label\">\n                                <input type=\"radio\" class=\"form-check-input inp\" name=\"entity_type\" id=\"entity_type\" value=\"individual\" data-type=\"radio\">\n                                ").concat(__('Individual'), "\n                                <i class=\"input-helper\"></i></label>\n                            </div>\n                          </div>\n                          <div class=\"col-sm-5\">\n                            <div class=\"form-check\">\n                              <label class=\"form-check-label\">\n                                <input type=\"radio\" class=\"form-check-input inp\" name=\"entity_type\" id=\"entity_type\" value=\"business\" data-type=\"radio\">\n                                ").concat(__('Business'), "\n                                <i class=\"input-helper\"></i></label>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <p class=\"card-description\">\n                        ").concat(__('Address'), "\n                    </p>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\"> ").concat(__('Address 1'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"addr1\" type=\"text\" class=\"form-control inp\" name=\"addr1\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('State'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"state\" type=\"text\" class=\"form-control inp\" name=\"state\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Address 2'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"addr2\" type=\"text\" class=\"form-control inp\" name=\"addr2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Postcode'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"post\" type=\"text\" class=\"form-control inp\" name=\"post\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('City'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"city\" type=\"text\" class=\"form-control inp\" name=\"city\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Country'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"country\" class=\"form-control inp\" name=\"country\" data-type=\"select\">\n                              <?php include('inc/select-countries.php'); ?>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <br>\n                    <hr>\n                    <br>\n                    <br>\n                    </div>\n                    <div class=\"tab-pane fade\" id=\"nav-payout\" role=\"tabpanel\" aria-labelledby=\"nav-payout-link\">\n                    <h4 id=\"payout\" class=\"card-title mb-4\" title=\"payouts\">").concat(__('Payout data'), "</h4>\n                    <p class=\"card-description\">").concat(__('This information is used to process your earnings as part of Kenzap Affiliate or Kenzap Designing programs.'), "</p>\n\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank account holder\'s name'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y1\" type=\"text\" class=\"form-control inp\" name=\"y1\" minlength=\"2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('IBAN/Account Nr.'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y2\" type=\"text\" class=\"form-control inp\" name=\"y2\" minlength=\"2\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('SWIFT Code'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y3\" type=\"text\" class=\"form-control inp\" name=\"y3\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank name'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y4\" type=\"text\" class=\"form-control inp\" name=\"y4\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"row\">\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank branch city'), "</label>\n                          <div class=\"col-sm-9\">\n                            <input id=\"y5\" type=\"text\" class=\"form-control inp\" name=\"y5\" data-type=\"text\">\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-lg-6\">\n                        <div class=\"form-group row mb-3 mt-1\">\n                          <label class=\"col-sm-3 col-form-label\">").concat(__('Bank branch country'), "</label>\n                          <div class=\"col-sm-9\">\n                            <select id=\"y6\" class=\"form-control inp\" name=\"y6\" data-type=\"select\">\n                              <?php include('inc/countries.php'); ?>\n                            </select>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    </div>\n\n                </div>\n              </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\" >   \n      <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" data-bs-delay=\"3000\">\n        <div class=\"d-flex\">  \n          <div class=\"toast-body\"></div>\n          <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n        </div>\n      </div>\n    </div>\n    ");
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
          text: __('Settings')
        }]);
      }

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

      var _iterator = _createForOfIteratorHelper(document.querySelectorAll('.form-control')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var s = _step.value;

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
          var toast = new bootstrap.Toast(document.querySelector('.toast'));
          document.querySelector('.toast .toast-body').innerHTML = __('Successfully updated');
          toast.show();
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
