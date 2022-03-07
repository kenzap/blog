// js dependencies
import { showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, getSiteId, toast, link } from '@kenzap/k-cloud';
import { HTMLContent } from "../_/_cnt_home.js"

// where everything happens
const _this = {

    state: {
        firstLoad: true,
        ajaxQueue: 0
    },
    init: () => {
        
        _this.getData(); 
    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();

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
                    locale: {
                        type:       'locale',
                        id:         getCookie('lang')
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

                // initiate locale
                // i18n.init(response.locale);

                // get core html content 
                _this.loadHomeStructure();  

                // render table
                _this.renderPage(response);

                // init header
                // _this.initHeader(response);

                // bind content listeners
                // _this.initListeners();
            
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
    renderPage: (product) => {

        let d = document;

        // initiate breadcrumbs
        initBreadcrumbs(
            [
                { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                { text: __('E-commerce') },
            ]
        );
    },
    // initHeader: (response) => {

    //     onClick('.nav-back', (e) => {

    //         e.preventDefault();
    //         console.log('.nav-back');
    //         let link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
    //         simulateClick(link);
    //     });
    // },
    initListeners: (type = 'partial') => {

        console.log('initListeners ');

        // listeners that can be initiated only once
        if(type == 'all'){

            // // product save button
            // onClick('.btn-save', _this.listeners.saveProduct);
            
            // // modal success button
            // onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
        }



    },
    listeners: {


        modalSuccessBtn: (e) => {
            
            console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    loadHomeStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
