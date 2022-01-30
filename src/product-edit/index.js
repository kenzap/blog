// js dependencies
import { getSiteId, getProductId, simulateClick, getCookie, parseApiError, onClick, onChange, formatPrice, initBreadcrumbs, link } from "../_/_helpers.js"
import { showLoader, hideLoader, simpleTags, initHeader, initFooter } from "../_/_ui.js"
import { HTMLContent } from "../_/_cnt_product_edit.js"

// where everything happens
const _this = {

    init: () => {
        
        _this.getData(); 
    },
    state: {

        ajaxQueue: 0
    },
    getData: () => {

        // block ui during load
        showLoader();

        let id = getProductId();
        let sid = getSiteId();

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
                    product: {
                        type:       'find',
                        key:        'ecommerce-product',
                        id:         id,   
                        fields:     ['_id', 'id', 'img', 'status', 'price', 'variations', 'priced', 'title', 'sdesc', 'ldesc', 'sku', 'cats', 'updated']
                    },
                    locale: {
                        type:       'locale',
                        id:         'en'
                    }
                }
            }) 
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if (response.success){

                // init header
                initHeader(response);
  
                // get core html content 
                document.querySelector('#contents').innerHTML = HTMLContent(__);

                // check product response
                if (response.product.length == 0) {
             
                    // $(".list").html(/*html*/`<tr><td colspan="3">No products to display. Please create one by clicking on the button above.</td></tr>`);
                    // $( "#loader" ).fadeOut( "fast" );
                    _this.initListeners('all');
                    return;
                }

                // let st = parseInt(data.list[i].status);
                let img = 'https://cdn.kenzap.com/loading.png';

                // if(typeof(response.product[i].img) !== 'undefined' && response.product[i].img[0] == 'true') img = 'https://preview.kenzap.cloud/S1000452/_site/images/product-'+response.product[i].id+'-1-100x100.jpeg?1630925420';
                
                // bind frontend data
                _this.renderPage(response.product);

                // load images if any
                _this.loadImages(response.product);

                // init page listeners
                _this.initListeners('all');
            
            }else{

                parseApiError(response);
            }
            
            // console.log('Success:', response);
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
                { link: link('https://dashboard/kenzap.cloud'), text: __('Dashboard') },
                { link: link('/'), text: __('E-commerce') },
                { link: link('/product-list/'), text: __('Product List') },
                { text: __('Product Edit') }
            ]
        );

        // general section
        d.querySelector("#p-title").value = product.title;
        d.querySelector("#p-sdesc").value = product.sdesc;
        d.querySelector("#p-ldesc").value = product.ldesc;

        // price section
        d.querySelector("#p-price").value = product.price;
        d.querySelector("#p-priced").value = product.priced;

        // price variation section
        console.log(product.variations);
        for(let m in product.variations){ 

            let vr = product.variations[m];
            let data = []; data['title'] = vr['title']; data['type'] = vr['type']; data['required'] = vr['required']; data['index'] = m;
  
            d.querySelector(".variation-blocks").innerHTML += _this.structMixBlock(data);

            for(let n in vr['data']){
  
              let vrd = vr['data'][n];
              let data = []; 
              data['title'] = vrd['title'];
              data['price'] = vrd['price'];
              data['type'] = vr['type'];
  
              // console.log(data['title']);
              d.querySelector(".var-block[data-index='"+m+"'] .offer-pricef").innerHTML += _this.structMixRow(data);
            }
        }

        // init status box
        document.querySelector('#p-status'+product.status).checked = true;

        // init categories
        let pcats = document.querySelector('#p-cats');
        if (product.cats) pcats.setAttribute('data-simple-tags', product.cats);
        const tags = new simpleTags(pcats);
    },
    initListeners: (type = 'partial') => {

        console.log('initListeners ');

        // listeners that can be initiated only once
        if(type == 'all'){

            // product save button
            onClick('.btn-save', _this.listeners.saveProduct);
            
            // modal success button
            onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
        }

        // add variation block
        onClick('.add-mix-block', _this.listeners.addMixBlock);
        
        // edit variation block
        onClick('.edit-block', _this.listeners.editBlock);

        // remove variation block
        onClick('.remove-block', _this.listeners.removeBlock);

        // add variation option
        onClick('.add-mix', _this.listeners.addMixOption);

        // remove variation option
        onClick('.remove-option', _this.listeners.removeOption);

    },
    listeners: {

        editBlock: (e) => {

            e.preventDefault();

            let amb = document.querySelector('.add-mix-block');
            amb.dataset.action = 'edit';
            amb.dataset.index = e.currentTarget.dataset.index;
            setTimeout(() => simulateClick(amb), 10);

            console.log('editBlock');
        },

        removeBlock: (e) => {

            e.preventDefault();

            let c = confirm(__('Remove entire block?'));
            if(c){ 
                e.currentTarget.parentNode.parentNode.remove();
                // e.currentTarget.parentElement.parentElement.remove();
             }

            console.log('removeBlock');
        },

        addMixBlock: (e) => {

            e.preventDefault();

            let action = e.currentTarget.dataset.action; // $(this).attr('data-action');
            let index = e.currentTarget.dataset.index; // $(this).attr('data-index');
            e.currentTarget.dataset.action = 'add'; // $(this).attr('data-action', 'add');

            console.log('index: ' + index);

            // init defaults
            let modal_title = __('Add Variation Block');
            let title = "";
            let type = "";
            let required = 0;
            let modal_btn = __('Add'), modal_cancel_btn = __('Cancel');

            // override defaults in editing mode
            if(action == 'edit'){

                modal_title = __('Edit Variation Block');

                title = document.querySelector(".var-block[data-index='"+index+"']").dataset.title;
                type  = document.querySelector(".var-block[data-index='"+index+"']").dataset.type;
                required = parseInt(document.querySelector(".var-block[data-index='"+index+"']").dataset.required);

                modal_btn = __('Save');
                // console.log(variations);
            }

            let pmodal = document.querySelector(".p-modal");
            let pmodalCont = new bootstrap.Modal(pmodal);
            
            pmodal.querySelector(".modal-title").innerHTML = modal_title;
            pmodal.querySelector(".btn-primary").innerHTML = modal_btn;
            pmodal.querySelector(".btn-secondary").innerHTML = modal_cancel_btn;

            pmodalCont.show();

            let modalHTml = `\
            <div class="form-cont">\
                <div class="form-group mb-3">\
                    <label for="mtitle" class="form-label">${ __('Save') }</label>\
                    <input type="text" class="form-control" id="mtitle" autocomplete="off" placeholder="Rice type" value="${ title }">\
                </div>\
                <div class="form-group mb-3">\
                    <label for="mtype" class="form-label">${ __('Input type') }</label>\
                    <select id="mtype" class="form-control " >\
                        <option ${ type=='radio'?'selected="selected"':'' } value="radio">${ __('Radio buttons') }</option>\
                        <option ${ type=='checkbox'?'selected="selected"':'' } value="checkbox">${ __('Checkboxes') }</option>\
                    </select>\
                    <p class="card-description">${ __('Define how this renders on frontend.') }</p>\
                </div>\
                <div class="form-group mb-3">\
                    <div class="form-check">\
                        <label for="id="mtype"" class="form-check-label form-label">\
                            <input id="mrequired" type="checkbox" class="form-check-input" ${ required==1?'checked="checked"':'' } value="1">\
                            ${ __('Required') }\
                        </label>\
                    </div>\
                    <p class="card-description">${ __('Make this variation mandatory for users.') }</p>\
                </div>\
                <div class="form-group mb-3 dn">\
                    <label for="mtype" class="form-label">${ __('Minimum required') }</label>\
                    <select id="mtype" class="form-control " >\
                        <option value="1">1</option>\
                        <option value="2">2</option>\
                    </select>\
                </div>\
            </div>`;

            pmodal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                let mtitle = pmodal.querySelector(".p-modal #mtitle").value;
                let mtype = pmodal.querySelector(".p-modal #mtype").value;
                let mrequired = pmodal.querySelector(".p-modal #mrequired:checked");
                mrequired = mrequired == null ? 0 : mrequired.value == "1" ? 1 : 0;
            
                if(mtitle.length<2){ alert(__('Please provide longer title')); return; }

                // add mix and match
                let data = []; data['title'] = mtitle; data['type'] = mtype; data['required'] = mrequired; data['index'] = document.querySelectorAll(".var-block").length;
                if(action == 'edit'){

                    document.querySelector(".var-block[data-index='"+index+"']").dataset.title = mtitle;
                    document.querySelector(".var-block[data-index='"+index+"']").dataset.type = mtype;
                    document.querySelector(".var-block[data-index='"+index+"']").dataset.required = mrequired;
                    document.querySelector(".var-block[data-index='"+index+"'] .title").innerHTML = mtitle;
                }

                if(action == 'add'){

                    if(document.querySelector(".variation-blocks .var-block") == null){
                        document.querySelector(".variation-blocks").innerHTML = _this.structMixBlock(data);
                    }else{
                        document.querySelector(".variation-blocks .var-block:last-of-type").insertAdjacentHTML('afterend', _this.structMixBlock(data));
                    }
                }

                pmodalCont.hide();

                setTimeout(() => _this.initListeners('partial'), 10);
            }

            console.log('addMixBlock');
        },

        addMixOption: (e) => {

            let block_el = e.currentTarget;
            e.preventDefault();

            let pmodal = document.querySelector(".p-modal");
            let pmodalCont = new bootstrap.Modal(pmodal);
            
            pmodalCont.show();

            pmodal.querySelector(".modal-title").innerHTML = __('Add Variation');
            pmodal.querySelector(".btn-primary").innerHTML = __('Add');
            pmodal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTML = `\
            <div class="form-cont">\
                <div class="form-group">\
                    <label for="mtitle" class="form-label">${ __('Title') }</label>\
                    <input type="text" class="form-control" id="mtitle" autocomplete="off" placeholder="${ __('Brown rice') }">\
                </div>\
                <div class="form-group">\
                    <label for="mprice" class="form-label">${ __('Price') }</label>\
                    <div class="input-group mb-3">
                        <span class="input-group-text">$</span>
                        <input id="mprice" type="text" class="form-control" placeholder="0.00" value="" >\
                        <p class="card-description">${ __('You can change default currency under Dashboard &gt; Settings.') }</p>\
                    </div>\
                </div>\
            </div>`;

            pmodal.querySelector(".modal-body").innerHTML = modalHTML;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                // validate
                let mtitle = pmodal.querySelector(".p-modal #mtitle").value;
                let mprice = pmodal.querySelector(".p-modal #mprice").value;
                if(mtitle.length<2){ alert("Please provide longer title"); return; }

                let data = []; data['title'] = mtitle; data['price'] = mprice; data['type'] = block_el.parentElement.parentElement.dataset.type;
                let sel = ".var-block[data-index='"+block_el.parentElement.parentElement.dataset.index+"']";
                console.log(sel);
                
                if(document.querySelector(sel + " .offer-pricef li") == null){
                    document.querySelector(sel + " .offer-pricef").innerHTML = _this.structMixRow(data);
                }else{
                    document.querySelector(sel + " .offer-pricef li:last-of-type").insertAdjacentHTML('afterend', _this.structMixRow(data));
                }

                pmodalCont.hide();

                setTimeout(() => _this.initListeners('partial'), 10);
            };
        },

        removeOption: (e) => {

            e.preventDefault();
            
            if( confirm('Remove option?') ) e.currentTarget.parentElement.remove();

            console.log('removeOption');
        },

        saveProduct: (e) => {
            
            e.preventDefault();

            let data = {};

            // iterate through input fields
            for( let inp of document.querySelectorAll('.inp') ){

                data[inp.id.replace("p-","")] = inp.value;
            }

            // map categories
            data["cats"] = [];
            for( let cat of document.querySelectorAll('#p-cats ul li') ){

                data["cats"].push(cat.innerHTML.replace('<a>×</a>','').trim());
            }
             
            // link uploaded images
            data["img"] = [];
            for( let img of document.querySelectorAll('.p-img') ){

                let tf = !img.getAttribute('src').includes("placeholder") ? true : false;
                data["img"].push(tf);
            }
            
            // status
            data["status"] = document.querySelector('input[name="p-status"]:checked').value;
   
            // map mix and match
            data["variations"] = [];
            let block_index = 0;
            for( let block of document.querySelectorAll('.variation-blocks .var-block') ){

                let option_index = 0;
                for( let option of block.querySelectorAll('.offer-pricef li') ){

                    if(typeof(data["variations"][block_index]) === 'undefined')
                    data["variations"][block_index] = 
                    { 
                        'title': block.getAttribute('data-title'),
                        'type': block.getAttribute('data-type'),
                        'required': block.getAttribute('data-required'),
                        'data': []
                    };
                    
                    data["variations"][block_index]['data'][option_index] = 
                    {
                        'title': option.getAttribute('data-title'),
                        'price': option.getAttribute('data-price'),
                        'cond': option.getAttribute('data-cond')
                    };
                    option_index++;
                }
                block_index++;
            }

            console.log(data);
        
            let id = getProductId();
            let sid = getSiteId();

            showLoader();

            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain',
                    'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                },
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'update',
                            key:        'ecommerce-product',
                            id:         id,         
                            sid:        sid,
                            data:       data
                        }
                    }
                }) 
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    // upload desc images
                    _this.uploadImages();
            
                    // successfully changed
                    // if(ajaxQueue==0){
            
                    // iqwerty.toast.toast('changes applied', toast);
                    // // $( "#loader" ).fadeOut( "fast" );
                    // }
                    
                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            console.log('saveProduct');
        },

        openImage: (e) => {

            e.preventDefault();
            simulateClick(document.querySelector(".aif-"+e.currentTarget.dataset.index));
        },

        previewImage: (e) => {

            e.preventDefault();

            let input = e.currentTarget;
            let toast = new bootstrap.Toast(document.querySelector('.p-toast'));

            if (input.files && input.files[0]) {

                // check image type
                if(input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/jpg' && input.files[0].type != 'image/png'){

                    document.querySelector('.p-toast .toast-body').innerHTML = __('Please provide image in JPEG format');  
                    toast.show();
                    return;
                }
          
                // check image size
                if(input.files[0].size > 5000000){

                    document.querySelector('.p-toast .toast-body').innerHTML = __('Please provide image less than 5 MB in size!');  
                    toast.show();
                    return;
                }

                let index = input.dataset.index;
                let reader = new FileReader();
                reader.onload = function(e) {
                  
                    console.log('target '+e.currentTarget.result);
                    document.querySelector('.images-'+index).setAttribute('src', e.currentTarget.result);
                }
                reader.readAsDataURL(input.files[0]);

                e.currentTarget.parentElement.querySelector('.remove').classList.remove("hd");
            }
        },

        removeImage: (e) => {

            let index = e.currentTarget.parentElement.dataset.index;
            document.querySelector('.aif-' + index).value = '';
            document.querySelector('.images-'+index).setAttribute('src', 'https://account.kenzap.com/images/placeholder.jpg');
            e.currentTarget.classList.add("hd");

            // $(this).addClass("hd");
            // $(".aif-"+$(this).parent().data("index")).val('');
            // $(".images-"+$(this).parent().data("index")).attr('src','https://account.kenzap.com/images/placeholder.jpg');
            // $(this).addClass("hd");
        },

        modalSuccessBtn: (e) => {
            
            console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },

    structMixBlock: (data) => {

        let html = '\
        <div class="mb-4 var-block mw" data-title="'+data.title+'" data-type="'+data.type+'" data-required="'+data.required+'" data-index="'+data.index+'" >\
            <label for="offer-pricef" class="form-label pb-2"><span class="title">' + data.title + '</span>\
                &nbsp;&nbsp;\
                <svg class="bi bi-pencil-fill edit-block ms-4" title="edit block" data-index="'+data.index+'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">\
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>\
                </svg>\
                <svg class="bi bi-trash remove-block ms-4" title="edit block" data-index="'+data.index+'"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" viewBox="0 0 16 16">\
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
    structMixRow: (data) => {

        return '\
        <li data-title="'+data.title+'" data-price="'+data.price+'" data-cond="" class="pt-2 pb-2"><div class="form-check"><label class="form-check-label form-label"><input class="'+data.type+' form-check-input" type="'+data.type+'" checked="" data-ft="'+data.title+'">'+data.title+' &nbsp;&nbsp;&nbsp; '+formatPrice(data.price)+'</label></div>\
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-option bi bi-x-circle" viewBox="0 0 16 16">\
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\
            </svg>\
        </li>';
    },
    loadImages: (product) => {

        let d = document;
        let lang = 'en';
        let offer_id = '0';
        let id = getProductId();
        let sid = getSiteId();
        let t = '';
        for(let i=0;i<5;i++){
     
          let img = (product.img !== undefined && product.img[i] == 'true') ? 'https://preview.kenzap.cloud/S'+getSiteId()+'/_site/images/product-'+product.id+'-'+(i+1)+'-100x100.jpeg?'+product.updated:'https://account.kenzap.com/images/placeholder.jpg';
          t+=`\
          <div class="p-img-cont float-start">\
            <p data-index="${i}">\
              <img class="p-img images-${i}" data-index="${i}" width="100" height="100" src="${img}" />\
              <span class="remove hd" title="${ __('Remove') }">×</span>\
            </p>\
            <input type="file" name="img[]" data-type="search" data-index="${i}" class="file aif-${i} d-none">\
          </div>`;
        }
        
        d.querySelector(".ic").innerHTML = t;
    
        // new image listener
        onClick('.p-img-cont img', _this.listeners.openImage);

        // new remove listener
        onClick('.p-img-cont .remove', _this.listeners.removeImage);

        // image preview listener
        onChange('.p-img-cont .file', _this.listeners.previewImage);
    
        // iterate all images
        for(let fi=0; fi<5; fi++){
    
            // async load image to verify if it exists on CDN 
            let image_url = CDN+'/S'+sid+'/product-'+id+'-'+(parseInt(fi)+1)+'-250.jpeg?'+product.updated;
            setTimeout(function(img, sel, _fi){
        
                let allow = true;
                if(typeof(product.img)!=="undefined"){ if(!product.img[_fi]) allow = false; }
                if(allow){

                    let i = new Image();
                    i.onload = function(){
                        d.querySelector(sel+_fi).setAttribute('src', img);
                        d.querySelector(sel+_fi).parentElement.querySelector('.remove').classList.remove('hd');
                    };
                    i.src=img;
                }
            }, 300, image_url, ".images-", fi );
        }
    },
    // general method for image upload
    uploadImages: () => {

        if( document.querySelector(".imgupnote") ) document.querySelector(".imgupnote").remove();

        let fi = 0;
        for( let fileEl of document.querySelectorAll(".file") ){

            fi += 1;

            let id = getProductId();
            let sid = getSiteId();

            // console.log(file);
            let file = fileEl.files[0];
            if(typeof(file) === "undefined") continue;

            // TODO add global sizes setting 
            let fd = new FormData();
            // let sizes = document.querySelector("body").dataset.sizes;
            let sizes = '1000|500|250|100x100';

            fd.append('id', id);
            fd.append('sid', sid);
            fd.append('pid', id);
            fd.append('key', 'image');
            fd.append('sizes', sizes);
            // fd.append('field', file);
            fd.append('file', file);
            fd.append('slug', 'product-'+id+'-'+fi);
            fd.append('token', getCookie('kenzap_token'));

            // clear input file so that its not updated again
            file.value = '';

            _this.state.ajaxQueue+=1;

            fetch("https://api-v1.kenzap.cloud/upload/",{
                body: fd,
                method: "post"
            })
            .then(response => response.json())
            .then(response => {

                _this.state.ajaxQueue -= 1;
                if(response.success && _this.state.ajaxQueue == 0){

                    let toast = new bootstrap.Toast(document.querySelector('.toast'));
                    document.querySelector('.toast .toast-body').innerHTML = __('Order updated');  
                    toast.show();

                    // hide UI loader
                    hideLoader();
                }
            });
        }
        
        // image upload notice
        if(_this.state.ajaxQueue == 0){

            let toast = new bootstrap.Toast(document.querySelector('.toast'));
            document.querySelector('.toast .toast-body').innerHTML = __('Order updated');  
            toast.show();

            hideLoader();
        }
    }
}

_this.init();