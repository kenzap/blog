// js dependencies
import { showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, onKeyUp, getSiteId, toast, link, slugify } from '@kenzap/k-cloud';
import { getPageNumber, getPagination, formatStatus, formatTags, formatTime, ImageDrop, simpleTags, unescapeHTML, formatCode, makeid } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_home.js"
// import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

// where everything happens
const _this = {
  
    state:{
        firstLoad: true,
        post: {},
        response: null,
        API_key: null,
        limit: 10, // number of records to load per table
        quill: null,
        mode: 'quill'
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
                // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Header': localStorage.hasOwnProperty('header'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(),
            },
            body: JSON.stringify({
                query: {
                    keys: {
                        type:       'api-key',
                        keys:       ['public']
                    },
                    user: {
                        type:       'authenticate',
                        fields:     ['id', 'avatar'],
                        // token:      getCookie('kenzap_token')
                    },
                    locale: {
                        type:       'locale',
                        id:         getCookie('lang')
                    },
                    posts: {
                        type:       'find',
                        key:        'blog-post',
                        fields:     ['_id', 'id', 'kid', 'img', 'slug', 'author', 'status', 'tags', 'title', 'updated', 'created'],
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

                _this.state.response = response;
                
                // init header
                initHeader(response);

                // get core html content 
                _this.loadPageStructure();  

                // render table
                _this.renderPage(response);

                // get rich text listeners
                _this.initRichText(response);

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
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    renderPage: (response) => {

        if(_this.state.firstLoad){

            // initiate breadcrumbs
            initBreadcrumbs(
                [
                    { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                    // { link: link('/'), text: __('Blog') },
                    { text: __('Blog posts') }
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
                        <div class="search-cont input-group input-group-sm mb-0 justify-content-start d-none">     
                            <input type="text" placeholder="${ __('Search articles') }" class="form-control border-top-0 border-start-0 border-end-0 rounded-0" aria-label="${ __('Search products') }" aria-describedby="inputGroup-sizing-sm" style="max-width: 200px;">
                        </div>
                        <span>${ __("Title") }</span>
                    </th>
                    <th>${ __("Status") }</th>
                    <th>${ __("Tags") }</th>
                    <th>${ __("Updated") }</th>
                    <th class="text-end pe-3"></th>
                </tr>`;
        }

        // no products in the list
        if (response.posts.length == 0) {

            document.querySelector(".table tbody").innerHTML = `<tr><td colspan="6">${ __("No articles to display.") }</td></tr>`;
            // $( "#loader" ).fadeOut( "fast" );
            // initListeners();
            return;
        }

        let sid = getSiteId();

        // generate website table
        let list = '';
        for (let i in response.posts) {

            let img = 'https://cdn.kenzap.com/loading.png';

            if(!response.posts[i].img) response.posts[i].img = [];
            // if(response.posts[i].img[0]) img = CDN + '/S'+sid+'/post-'+response.posts[i].img[0]+'-100.jpeg' +'?' + response.posts[i].updated;
            if(response.posts[i].img[0]) img = response.posts[i].img[0].replace('-720.jpeg', '-100.jpeg') + '?' + response.posts[i].updated;
              
            list += `
                <tr>
                    <td>
                        <div class="timgc ">
                            <a class="edit-post " href="#"><img src="${ img }" data-srcset="${ img }" class="img-fluid rounded" alt="${ __("Product placeholder") }" srcset="${ img }" ></a>
                        </div>
                    </td>
                    <td class="destt" style="max-width:250px;min-width:250px;">
                        <div class="mb-2 mt-2"> 
                            <a class="post-title edit-post" data-id="${ response.posts[i]._id }" href="#" >${ response.posts[i].title }<i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="${ __("Edit product") }" class="mdi mdi-pencil menu-icon edit-page"></i></a>
                        </div>
                    </td>
                    <td>
                        <span class="edit-settings" data-i="${i}" data-id="${ response.posts[i]._id }" data-title="${ response.posts[i].title }">${ formatStatus(response.posts[i].status) }</span>
                    </td>
                    <td style="max-width:200px;">
                        <span class="edit-settings" data-i="${i}" data-id="${ response.posts[i]._id }" data-title="${ response.posts[i].title }">${ formatTags(response.posts[i].tags) }</span>
                    </td>
                    <td>
                        <span>${ formatTime(response.posts[i].updated) }</span>
                    </td>
                    <td class="d-none"> 
                        <a href="#" data-id="${ response.posts[i]._id }" class="remove-post text-danger ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </a>
                        <i title="${ __("Remove this product") }" data-key="${ response.posts[i].id }" class="mdi mdi-trash-can-outline list-icon remove-post"></i>
                    </td>
                    <td style="text-align:right;" class="">
                        <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuSizeButton${i}" data-i="${i}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${ __('Option') }</button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuSizeButton${i}" >
                            <a class="dropdown-item preview" href="${ 'https://kenzap.com/post/' + response.posts[i].slug }" target="_blank" data-id="${ response.posts[i]._id }" >${ __('Preview') }</a>
                            <a class="dropdown-item edit-post" href="#" target="_self" data-id="${ response.posts[i]._id }" >${ __('Edit') }</a>
                            <a class="dropdown-item rename-layout d-none" href="#" data-toggle="modal" data-id="${ response.posts[i]._id }" >${ __('Preview') }</a>
                            <a class="dropdown-item edit-settings" href="#" data-toggle="modal" data-i="${i}" data-id="${ response.posts[i]._id }" data-title="${ response.posts[i].title }">${ __('Settings') }</a>
                            <a class="dropdown-item duplicate-layout d-none" href="#" data-toggle="modal" data-id="${ response.posts[i]._id }" >${ __('Duplicate') }</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item remove-post text-danger " href="#" data-toggle="modal" data-id="${ response.posts[i]._id }" >${ __('Remove') }</a>
                        </div>
                    </td>
                </tr>`; 
        }

        // provide result to the page
        document.querySelector(".table tbody").innerHTML = list;
    },
    initRichText: () => {

        // callback after dependencies loaded
        // let cbf = function cbf() {

      
        // }

        _this.loadDependencies('quill-1.3.7.min.js');
        // _this.loadDependencies('quill.bubble-1.3.7.css');
    },
    initListeners: () => {

        // remove product
        onClick('.remove-post', _this.listeners.removePost);
 
        // search products activation
        onClick('.table-p-list .bi-search', _this.listeners.searchProductsActivate);

        // update article modal
        onClick('.edit-post', _this.editPost);

        // load post settings
        onClick('.edit-settings', _this.editSettings);

        // break here if initListeners is called more than once
        if(!_this.state.firstLoad) return;

        // add article modal
        onClick('.btn-add', _this.addPost);

        // add product confirm
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        htmlEditor: (e) => {

            e.preventDefault();

            if(e.currentTarget.classList.contains('enabled')){
   
                _this.state.mode = 'quill';

                toast(__('HTML editor mode off'));
                document.querySelector('.form-editor').classList.add('d-none');
                document.querySelector('.form-quill').classList.remove('d-none');

                _this.state.quill.container.firstChild.innerHTML = unescapeHTML(document.querySelector('.form-editor > pre').innerHTML);

                e.currentTarget.classList.remove('enabled');

            }else{

                _this.state.mode = 'editor';

                toast(__('HTML editor mode on'));
                document.querySelector('.form-editor').classList.remove('d-none');
                document.querySelector('.form-editor > pre').innerHTML = formatCode(_this.state.post.text, true, true);
                document.querySelector('.form-quill').classList.add('d-none');
                
                e.currentTarget.classList.add('enabled');
            }
        },

        removePost: (e) => {

            e.preventDefault();

            let c = confirm( __('Remove this post?') );

            if(!c) return;
  
            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain',
                    'Kenzap-Token': getCookie('kenzap_token'),
                    'Kenzap-Sid': getSiteId(),
                },
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'delete',
                            key:        'blog-post',   
                            id:         e.currentTarget.dataset.id,
                        },
                        action: {
                            type:       'webhook',     
                            data:       [
                                {
                                    'content-type': 'application/json',
                                    'url': 'https://api.kenzap.com/v1/?cmd=remove_blog_post&id=' + e.currentTarget.dataset.id + '&token=' + _this.state.response.keys.public_token
                                }
                            ]
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
                
                // console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
 
        searchProductsActivate: (e) => {

            e.preventDefault();

            document.querySelector('.table-p-list thead tr th:nth-child(2) span').style.display = 'none';
            document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont').classList.remove('d-none');
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
            
            // console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    addPost: (e) => {

        _this.state.post.id = e.currentTarget.dataset.postid;
        _this.state.post.text = '';
        _this.state.post.status = '1';

        _this.loadEditor();
    },
    editPost: (e) => {

        _this.state.post.id = e.currentTarget.dataset.id;
        // console.log(_this.state.post.id);

        e.preventDefault();

        // get blog post text
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Header': localStorage.hasOwnProperty('header'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(),
            },
            body: JSON.stringify({
                query: {
                    post: {
                        type:       'find',
                        key:        'blog-post',
                        fields:     ['_id', 'title', 'text'],
                        id:         _this.state.post.id,
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                // console.log(response);

                _this.state.post.text = response.post.text;

                _this.loadEditor();

            }else{

                parseApiError(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    editSettings: (e) => {

        // console.log(_this.state.post.id);
        let i = e.currentTarget.dataset.i;
        let modal = document.querySelector(".modal");
        let modalCont = new bootstrap.Modal(modal);

        modal.querySelector(".modal-dialog").classList.remove('modal-fullscreen');
        modal.querySelector(".modal-title").innerHTML = e.currentTarget.dataset.title;
        modal.querySelector(".btn-primary").innerHTML = __('Update');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

        let modalHTml = `\
        <div class="form-cont">\
            <div class="form-group mb-3 row">
                <label for="status" class="form-label">${ __('Status') }</label>\
                <div class="col-sm-12 col-md-5">
                    <div class="mt-3" role="status" aria-live="polite">
                        <label class="form-check-label status-publish form-label">
                            <input type="radio" class="form-check-input me-1" name="status" id="status0" value="0" ${ _this.state.response.posts[i].status == "0" ? 'checked' : '' }>
                                ${ __('Draft') }
                        </label>
                    </div>
                </div>
                <div class="col-sm-12 col-md-7">
                    <div class="mt-3"> 
                        <label class="form-check-label status-publish form-label">
                            <input type="radio" class="form-check-input me-1" name="status" id="status1" value="1" ${ _this.state.response.posts[i].status == "1" ? 'checked' : '' }>
                                ${ __('Published') }
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group mb-3">\
                <label for="author" class="form-label">${ __('Author') }</label>\
                <input type="text" class="form-control" id="author" autocomplete="off" placeholder="" value="${ _this.state.response.posts[i].author ? _this.state.response.posts[i].author : '' }">\
            </div>\
            <div class="form-group mb-3">\
                <label for="p-sdesc" class="form-label">${ __('Tags') }</label>\
                <div id="tags" class="simple-tags mb-4" data-simple-tags=""></div>
            </div>\
        </div>`;

        modal.querySelector(".modal-body").innerHTML = modalHTml;

        let tags = modal.querySelector('#tags');
        if (_this.state.response.posts[i].tags) tags.setAttribute('data-simple-tags', _this.state.response.posts[i].tags );
        const sTags = new simpleTags(tags);

        _this.listeners.modalSuccessBtnFunc = (e) => {

            e.preventDefault();

            // structure post object
            let data = {};

            data.kid = _this.state.response.user.id
            data.author = modal.querySelector("#author").value;
            data.status = modal.querySelector('input[name="status"]:checked').value;
            data.tags = [];
            for( let tag of modal.querySelectorAll('#tags ul li') ){

                data.tags.push(tag.innerHTML.replace('<a>×</a>','').trim());
            }

            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain',
                    // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                    'Kenzap-Token': getCookie('kenzap_token'),
                    'Kenzap-Sid': getSiteId(),
                },
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'update',
                            key:        'blog-post',   
                            id:         _this.state.response.posts[i]._id,         
                            data:       data
                        }
                        ,action: {
                            type:       'webhook',     
                            data:       [
                                { 
                                    'content-type': 'application/json',
                                    'url': 'https://api.kenzap.com/v1/?cmd=update_blog_post&id=' + _this.state.response.posts[i]._id + '&token=' + _this.state.response.keys.public_token
                                }
                            ]
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){
                    
                    _this.getData();

                    modalCont.hide();

                }else{

                    parseApiError(response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        modalCont.show();
    },
    loadEditor: () => {

        // console.log(_this.state.post.id);

        let blogContent = _this.state.post.text == '' ? localStorage.getItem('article'+_this.state.post.id) : _this.state.post.text;
        let modal = document.querySelector(".modal");
        let modalCont = new bootstrap.Modal(modal);

        modal.querySelector(".modal-dialog").classList.add('modal-fullscreen');

        if(_this.state.post.id == "0"){

            modal.querySelector(".modal-title").innerHTML = __('Add Article');
            modal.querySelector(".btn-primary").innerHTML = __('Add');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        }else{
        
            modal.querySelector(".btn-primary").innerHTML = __('Update');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        }

        modal.querySelector(".modal-title").innerHTML = '\
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="bi bi-code-square ql-html-edit" width="24" height="24" >\
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>\
            <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"></path>\
        </svg>';
  
        let title = '', sdesc = '';
        let modalHTML = `\
        <div class="form-cont">\
            <div class="form-editor d-none" >
                <pre class="ql-syntax" spellcheck="false"  data-gramm="false" contenteditable="true"></pre>
            </div>
            <div class="form-group mb-3 d-none">\
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInput" placeholder="">
                    <label for="floatingInput">Title</label>
                </div>
                <label for="p-title" class="form-label d-none">${ __('Title') }</label>\
                <input type="text" class="form-control" id="p-title" autocomplete="off" placeholder="" value="${ title }">\
            </div>\
            <div class="form-quill form-group mb-3 scrolling-container">\
                <label for="p-sdesc" class="form-label d-none">${ __('Content') }</label>\
                <div id="msginp" data-key="msginp" data-type="richtext" name="msginp" class="richtext-input inps"> </div>\
                <input type="text" class="form-control d-none" id="p-sdesc" autocomplete="off" placeholder="" value="${ sdesc }">\
            </div>\
        </div>`;

        modal.querySelector(".modal-body").innerHTML = modalHTML;

        // initiate quill rich text editor
        let elem = modal.querySelector(".richtext-input");
        elem.classList.add('blog');

        // Quill.register("modules/htmlEditButton", htmlEditButton);
        // Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
        // Quill.debug("warn");
        // Quill.register("modules/imageUploader", ImageUploader);
        Quill.register('modules/imageDrop', ImageDrop);

        _this.state.quill = new Quill(elem, {

            modules: { 
                toolbar: [
                    [ { 'header': [1, 2, 3, 4, 5, 6, false] } ],
                    [ 'bold', 'italic', 'link' ],
                    // [ 'image' ],
                    [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
                    [ 'blockquote', 'code-block', { 'background': [] } ],
                    // [ { 'script': 'sub'}, { 'script': 'super' } ],      // superscript/subscript
                    // [ { 'indent': '-1'}, { 'indent': '+1' } ], 
                
                ]
                ,clipboard: {
                    // matchVisual: false
                }
                ,imageDrop: true
          
            },
            scrollingContainer: '.scrolling-container', 
            placeholder: __('Start typing..'),
            theme: 'bubble'
        });

        // text change listener
        _this.state.quill.on('text-change', function(delta, oldDelta, source) {
            
            let _cb = _this.state.quill.container.parentElement.querySelector(".richtext-input");
            
            // clean garbage
            let text = _this.state.quill.container.firstChild.innerHTML;

            // console.log(text);

            _this.state.post.text = _this.cleanMsg(text);

            // _this.state.post.text = text;
        
            // cache in browser in case window refreshes
            localStorage.setItem('article'+_this.state.post.id, _this.cleanMsg(text));
        });

        // restore previous text
        _this.state.quill.container.firstChild.innerHTML = blogContent;

        // html editor listener
        onClick('.ql-html-edit', _this.listeners.htmlEditor);

        // remove default quill styling
        document.querySelector('.ql-editor').classList.add('entry-content');
        // document.querySelector('.ql-editor').classList.remove('ql-editor');
        document.querySelector('html').style.fontSize = '70%';
        
        // modal close listener
        modal.addEventListener('hidden.bs.modal', function (event) {

            document.querySelector('html').style.fontSize = '100%';
        });

        // save button
        _this.listeners.modalSuccessBtnFunc = (e) => {

            e.preventDefault();

            if(_this.state.mode == 'editor'){

                _this.state.post.text = unescapeHTML(document.querySelector('.form-editor > pre').innerHTML);
            }

            // structure post object
            let data = {};
            data.title =  _this.state.post.text.substring( _this.state.post.text.indexOf('<h1') + 4,  _this.state.post.text.indexOf('</h1>'));
            data.text = _this.state.post.text;
            data.img = [];

            // find all images
            // const re = /(<img.+src=")(.*)(">)/ig;
            // const re = /(post-)(.*)(-720.jpeg)/igm;
            // const matches = _this.state.post.text.matchAll(re);

            const matches = _this.state.post.text.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
            if(matches){

                const sources = matches.map(x => x.replace(/.*src="([^"]*)".*/, '$1'));
                for (const src of sources) {

                    // console.log(`Found ${match[2]} start=${match.index} end=${match.index + match[0].length}.`);
    
                    data.img.push(src);
                }

                // console.log(sources);

                console.log(data.img);
            }

            // let imgs = input.match(/<.+>/g);
            // let srcs = imgs.map(img => img.match(/src=".+"/g)[0])
            //             .map(src => src.substring(0, src.length-1).replace('src="', ''));

            // for(let i=0; i < imgs.length; i++){
            //     input = input.replace(imgs[i], srcs[i]);
            // }

            // const parsedContents = data.text.replace(re, "$2");
            // console.log(parsedContents);
                        
            // data.sdesc = modal.querySelector("#p-sdesc").value;
            // data.price = modal.querySelector("#p-price").value;
           
            // data.img = [];
            
            if(data.title.length<2){ alert(__('Please provide "Heading 1" title')); return; }

            // gen slug
            if( _this.state.post.id == "0"){

                data.status = "0";
                data.kid = _this.state.response.user.id
                data.slug = slugify(data.title) + '-' + makeid(6);
                data.tags = [];
                
                // send data
                fetch('https://api-v1.kenzap.cloud/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain',
                        // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                        'Kenzap-Token': getCookie('kenzap_token'),
                        'Kenzap-Sid': getSiteId(),
                    },
                    body: JSON.stringify({
                        query: {
                            product: {
                                type:       'create',
                                key:        'blog-post',   
                                data:       data
                            }
                            // ,action: {
                            //     type:       'webhook',     
                            //     data:       [
                            //         { 
                            //             'content-type': 'application/json',
                            //             'url': 'https://api.kenzap.com/v1/?cmd=update_blog_post&id=' + _this.state.response.posts[i]._id + '&token=' + _this.state.response.keys.public_token
                            //         }
                            //     ]
                            // }
                        }
                    }) 
                })
                .then(response => response.json())
                .then(response => {

                    if (response.success){

                        // open product editing page
                        // window.location.href = `/product-edit/?id=${ response.product.id}`

                        localStorage.setItem('article'+_this.state.post.id, "");

                        _this.getData();

                        modalCont.hide();

                    }else{

                        parseApiError(response);
                    }
                    
                    console.log('Success:', response);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            }else{

                // send data
                fetch('https://api-v1.kenzap.cloud/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain',
                        // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                        'Kenzap-Token': getCookie('kenzap_token'),
                        'Kenzap-Sid': getSiteId(),
                    },
                    body: JSON.stringify({
                        query: {
                            product: {
                                type:       'update',
                                key:        'blog-post',   
                                id:         _this.state.post.id,         
                                data:       data
                            }
                            ,action: {
                                type:       'webhook',     
                                data:       [
                                    { 
                                        'content-type': 'application/json',
                                        'url': 'https://api.kenzap.com/v1/?cmd=update_blog_post&id=' + _this.state.post.id + '&token=' + _this.state.response.keys.public_token
                                    }
                                ]
                            }
                        }
                    })
                })
                .then(response => response.json())
                .then(response => {

                    if (response.success){
                        
                        localStorage.setItem('article'+_this.state.post.id, "");

                        toast(__('Changes applied'));

                        _this.getData();

                        modalCont.hide();

                    }else{

                        parseApiError(response);
                    }
                    
                    //  console.log('Success:', response);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }

        modalCont.show();
    },
    /*
    * Load additional JS or CSS depencies from sites/js/controls folder
    *
    * @param    dep       dependecy. Ex.: hiebee.min.js 
    * @param    cb        function to call after script is loaded (optional)       
    * @return 	{Boolen} 	result status 
    * 
    */
    loadDependencies: (dep, cb) => {

        // dependency already loaded, skip
        if(document.getElementById(dep)){ if(typeof cb === 'function') cb.call(); return; }

        // detect dependency type
        let t = dep.split('.').slice(-1)[0];
        switch(t){

            case 'js':
                
                let js = document.createElement("script");
                js.setAttribute("src", "https://static.kenzap.com/libs/"+dep);
                js.id = dep;
                js.onload = js.onreadystatechange = function() {
        
                if(!this.readyState || this.readyState == 'complete')
                    if(typeof cb === 'function') cb.call();
                };
                document.body.appendChild(js);
                
            break;
            case 'css':

                var head  = document.getElementsByTagName('head')[0];
                var css  = document.createElement('link');
                css.id   = dep;
                css.rel  = 'stylesheet';
                css.type = 'text/css';
                css.href = 'https://static.kenzap.com/libs/'+dep;
                head.appendChild(css);

            break;
        }
        return true;
    },
    /**
     * Process rich text image uploads
     * @public
     */
    imageHandler: (imageDataUrl, type, imageData) => {
        

        const blob = imageData.toBlob()
        const file = imageData.toFile()
      
        // generate a form data
        const formData = new FormData()
      
        // append blob data
        formData.append('file', blob)
      
        // or just append the file
        formData.append('file', file)
      
        // upload image to your server
        console.log("imageHandler");

        // callUploadAPI(your_upload_url, formData, (err, res) => {
        //   if (err) return
        //   // success? you should return the uploaded image's url
        //   // then insert into the quill editor
        //   let index = (quill.getSelection() || {}).index;
        //   if (index === undefined || index < 0) index = quill.getLength();
        //   quill.insertEmbed(index, 'image', res.data.image_url, 'user')
        // })
    },
    /**
     * Clean message from unwanted tags
     * @public
     */
    cleanMsg: (text) => {

        // text = text.replace('<p></p>','');
        // text = text.replace('<p><br></p>','');
        text = text.replace('<h1><br></h1>','');
        text = text.replace('<h2><br></h2>','');
        text = text.replace('<h3><br></h3>','');
        text = text.replace('<h4><br></h4>','');

        return text;
    },
    initPagination: (response) => {

        getPagination(response.meta, _this.getData);
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    },
}

_this.init();