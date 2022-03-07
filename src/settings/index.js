// js dependencies
import { showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, onKeyUp, simulateClick, getSiteId, toast, link } from '@kenzap/k-cloud';
import { getCurrencies } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_settings.js"

// where everything happens
const _this = {
   
    state:{
        firstLoad: true,
        limit: 10, // number of records to load per table
    },
    init: () => {
         
        _this.getData();
    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();

        // search content
        let s = document.querySelector('.search-cont input') ? document.querySelector('.search-cont input').value : '';

        // do API query
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Header': localStorage.hasOwnProperty('header'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(),
            },
            body: JSON.stringify({
                query: {
                    user: {
                        type:       'authenticate',
                        fields:     ['avatar'],
                        token:      getCookie('kenzap_token')
                    },
                    locale: {
                        type:       'locale',
                        id:         getCookie('lang')
                    },
                    settings: {
                        type:       'get',
                        key:        'ecommerce-settings',
                        fields:     '*',
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                // init header
                initHeader(response);
                
                // get core html content 
                _this.loadPageStructure();  

                // render table
                _this.renderPage(response);

                // bind content listeners
                _this.initListeners();
            
                // initiate footer
                _this.initFooter();

                // first load
                _this.state.firstLoad = false;

            }else{

                parseApiError(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    authUser: (response) => {

        if(response.user){
            
            if(response.user.success == true){

                
            }
        }
    },
    loadPageStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    renderPage: (response) => {

        if(_this.state.firstLoad){

            // initiate breadcrumbs
            initBreadcrumbs(
                [
                    { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                    { link: link('/'), text: __('E-commerce') },
                    { text: __('Settings') }
                ]
            );
        }

        // setup currencies
        let coptions = '<option value="">'+__('Choose currency')+'</option>';
        for (let c of getCurrencies()){

            coptions += `<option value="${ c.code }">${ __(c.name) } (${ __(c.code) })</option>`;
        }
        document.querySelector("#currency").innerHTML = coptions;

        // populate fields
        for (let field in response.settings){

            if(typeof(response.settings[field]) === "undefined") continue;
            if(response.settings[field] == "") continue;
            if(document.querySelector("#"+field)) switch(document.querySelector("#"+field).dataset.type){
        
                case 'text':   
                case 'email':  
                case 'emails':  
                case 'select':
                case 'textarea': document.querySelector("#"+field).value = response.settings[field]; break;
                // case 'radio': $("#"+field).parent().parent().parent().parent().parent().find("input[value=" + data.res[field] + "]").prop('checked', true); break;
            }
        }

        // for(let s of document.querySelectorAll('.form-control')){

        //     switch(s.dataset.type){
          
        //         case 'text':   
        //         case 'email':  
        //         case 'emails':  
        //         case 'select':
        //         case 'textarea': data[s.id] = s.value; break;
        //         case 'radio': data[s.id] = s.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('input:checked').value; break;
        //     }

        let sid = getSiteId();

        // bind settings data
  
        // provide result to the page
        // document.querySelector(".table tbody").innerHTML = list;
    },
    initListeners: () => {

        // break here if initListeners is called more than once
        if(!_this.state.firstLoad) return;

        // add product modal
        onClick('.btn-save', _this.saveSettings);
    },
    listeners: {

        removeProduct: (e) => {

            e.preventDefault();

            let c = confirm( __('Completely remove this product?') );

            if(!c) return;
  
            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain',
                    'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                    'Kenzap-Token': getCookie('kenzap_token'),
                    'Kenzap-Sid': getSiteId(),
                },
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'delete',
                            key:        'product',   
                            id:         e.currentTarget.dataset.id, 
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    // modalCont.hide();

                    _this.getData();

                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
 
        },
 
        searchProductsActivate: (e) => {

            e.preventDefault();

            document.querySelector('.table-p-list thead tr th:nth-child(2) span').style.display = 'none';
            document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont').style.display = 'flex';
            document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont input').focus();

            // search products
            onKeyUp('.table-p-list thead tr th:nth-child(2) .search-cont input', _this.listeners.searchProducts);
        },
 
        searchProducts: (e) => {

            e.preventDefault();

            _this.getData();

            // console.log('search products ' +e.currentTarget.value);
        },

        modalSuccessBtn: (e) => {
            
            console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    saveSettings: (e) => {

        e.preventDefault();

        let data = {};

        // iterate through all fields
        for(let s of document.querySelectorAll('.form-control')){

            switch(s.dataset.type){
          
                case 'text':   
                case 'email':  
                case 'emails':  
                case 'select':
                case 'textarea': data[s.id] = s.value; break;
                case 'radio': data[s.id] = s.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('input:checked').value; break;
            }
        }

        // send data
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(),
            },
            body: JSON.stringify({
                query: {
                    settings: {
                        type:       'set',
                        key:        'ecommerce-settings',       
                        data:       data
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            if (response.success){

                let toast = new bootstrap.Toast(document.querySelector('.toast'));
                document.querySelector('.toast .toast-body').innerHTML = __('Successfully updated');  
                toast.show();

                // modalCont.hide();

                // _this.getData();

                // open product editing page
                // window.location.href = `/product-edit/?id=${ response.product.id}`

            }else{

                parseApiError(response);
            }
            
            console.log('Success:', response);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        console.log('saveSettings');
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();