// js dependencies
import { getSiteId, getPageNumber, getPagination, simulateClick, getCookie, initBreadcrumbs, parseApiError, formatStatus, formatPrice, formatTime, onClick, onKeyUp, link } from "../_/_helpers.js"
import { showLoader, hideLoader, initHeader, initFooter } from "../_/_ui.js"
import { productListContent } from "../_/_cnt_product_list.js"

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
                    products: {
                        type:       'find',
                        key:        'ecommerce-product',
                        fields:     ['_id', 'id', 'img', 'status', 'price', 'title', 'updated'],
                        limit:      _this.state.limit,
                        offset:     s.length > 0 ? 0 : getPageNumber() * _this.state.limit - _this.state.limit,    // automatically calculate the offset of table pagination
                        search:     {                                                           // if s is empty search query is ignored
                                        field: 'title',
                                        s: s
                                    },
                        sortby:     {
                                        field: 'created',
                                        order: 'DESC'
                                    },
                        // groupby:    [
                        //                 {
                        //                     field: 'created',
                        //                 }
                        //             ]
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
            
                // init pagination
                _this.initPagination(response);

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
        document.querySelector('#contents').innerHTML = productListContent(__);
    },
    renderPage: (response) => {

        if(_this.state.firstLoad){

            // initiate breadcrumbs
            initBreadcrumbs(
                [
                    { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                    { link: link('/'), text: __('E-commerce') },
                    { text: __('Product list') }
                ]
            );

            // init table header
            document.querySelector(".table thead").innerHTML = `
                <tr>
                    <th>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#212529" class="bi justify-content-end bi-search mb-1" viewBox="0 0 16 16" >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                        </svg>
                    </th>
                    <th>
                        <div class="search-cont input-group input-group-sm mb-0 justify-content-start">     
                            <input type="text" placeholder="${ __('Search products') }" class="form-control border-top-0 border-start-0 border-end-0 rounded-0" aria-label="${ __('Search products') }" aria-describedby="inputGroup-sizing-sm" style="max-width: 200px;">
                        </div>
                        <span>${ __("Title") }</span>
                    </th>
                    <th>${ __("Status") }</th>
                    <th>${ __("Price") }</th>
                    <th>${ __("Last change") }</th>
                    <th></th>
                </tr>`;

        }

        // no products in the list
        if (response.products.length == 0) {

            document.querySelector(".table tbody").innerHTML = `<tr><td colspan="6">${ __("No products to display.") }</td></tr>`;
            // $( "#loader" ).fadeOut( "fast" );
            // initListeners();
            return;
        }

        let sid = getSiteId();

        // generate website table
        let list = '';
        for (let i in response.products) {

            let img = 'https://cdn.kenzap.com/loading.png';

            if(typeof(response.products[i].img) === 'undefined') response.products[i].img = [];
            // if(typeof(response.products[i].img) !== 'undefined' && response.products[i].img[0] == 'true') img = 'https://preview.kenzap.cloud/S1000452/_site/images/product-'+response.products[i].id+'-1-100x100.jpeg?1630925420';
            if(response.products[i].img[0]) img = CDN + '/S'+sid+'/product-'+response.products[i]._id+'-1-100x100.jpeg?'+response.products[i].updated;
              
            list += `
                <tr>
                    <td>
                        <div class="timgc">
                            <a href="${ link('/product-edit/?id='+response.products[i]._id) }"><img src="${ img }" data-srcset="${ img }" class="img-fluid rounded" alt="${ __("Product placeholder") }" srcset="${ img }" ></a>
                        </div>
                    </td>
                    <td class="destt" style="max-width:250px;min-width:250px;">
                        <div class="mb-3 mt-3"> 
                            <a class="text-body" href="${ link('/product-edit/?id='+response.products[i]._id) }" >${ response.products[i].title }<i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="${ __("Edit product") }" class="mdi mdi-pencil menu-icon edit-page"></i></a>
                        </div>
                    </td>
                    <td>
                        <span>${ formatStatus(response.products[i].status) }</span>
                    </td>
                    <td>
                        <span>${ formatPrice(response.products[i].price) }</span>
                    </td>
                    <td>
                        <span>${ formatTime(response.products[i].updated) }</span>
                    </td>
                    <td> 
                        <a href="#" data-id="${ response.products[i]._id }" class="remove-product text-danger ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </a>
                        <i title="${ __("Remove this product") }" data-key="${ response.products[i].id }" class="mdi mdi-trash-can-outline list-icon remove-product"></i>
                    </td>
                </tr>`; 
        }

        // provide result to the page
        document.querySelector(".table tbody").innerHTML = list;
    },
    initListeners: () => {

        // _this.state.firstLoad ? 'all' : 'partial'

        // if(type == 'all'){

        // }

        // remove product
        onClick('.remove-product', _this.listeners.removeProduct);

        // search products activation
        onClick('.table-p-list .bi-search', _this.listeners.searchProductsActivate);

        // break here if initListeners is called more than once
        if(!_this.state.firstLoad) return;

        // add product modal
        onClick('.btn-add', _this.addProduct);

        // add product confirm
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
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
                            key:        'ecommerce-product',   
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
    addProduct: (e) => {

        let modal = document.querySelector(".modal");
        let modalCont = new bootstrap.Modal(modal);
        
        modal.querySelector(".modal-title").innerHTML = __('Add Product');
        modal.querySelector(".btn-primary").innerHTML = __('Add');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        let d = ""; 
        let title = '', sdesc = '', price = '';
        let modalHTml = `\
        <div class="form-cont">\
            <div class="form-group mb-3">\
                <label for="p-title" class="form-label">${ __('Title') }</label>\
                <input type="text" class="form-control" id="p-title" autocomplete="off" placeholder="" value="${ title }">\
            </div>\
            <div class="form-group mb-3">\
                <label for="p-sdesc" class="form-label">${ __('Short description') }</label>\
                <input type="text" class="form-control" id="p-sdesc" autocomplete="off" placeholder="" value="${ sdesc }">\
            </div>\
            <div class="form-group mb-3">\
                <label for="p-price" class="form-label">${ __('Price') }</label>\
                <input type="text" class="form-control" id="p-price" autocomplete="off" placeholder="" value="${ price }">\
            </div>\
        </div>`;

        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = (e) => {

            e.preventDefault();

            let data = {};
            data.title = modal.querySelector("#p-title").value;
            data.sdesc = modal.querySelector("#p-sdesc").value;
            data.price = modal.querySelector("#p-price").value;
            data.status = "0";
            data.img = [];
            data.cats = [];

            if(data.title.length<2){ alert(__('Please provide longer title')); return; }

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
                            type:       'create',
                            key:        'ecommerce-product',   
                            data:       data
                        }
                    }
                }) 
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    // open product editing page
                    window.location.href = `/product-edit/?id=${ response.product.id}`

                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            console.log('saveProduct');

        }

        modalCont.show();

        setTimeout( () => modal.querySelector("#p-title").focus(),100 );

    },
    initPagination: (response) => {

        getPagination(response.meta, _this.getData);
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();